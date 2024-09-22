"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Papa from "papaparse";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CertificateEditor() {
  const [certificateImage, setCertificateImage] = useState<string | null>(null);
  const [names, setNames] = useState<string[]>([]);
  const [textPosition, setTextPosition] = useState({ x: 100, y: 100 });
  const [fontSize, setFontSize] = useState(50);
  const [fontColor, setFontColor] = useState("#000000");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedName, setSelectedName] = useState<string>("");
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setCertificateImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleCSVUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        Papa.parse(file, {
          complete: (results) => {
            const data = results.data as string[][];
            const filteredNames = data.flat().filter(Boolean);
            setNames(filteredNames);
            setSelectedName(filteredNames[0] || "");
          },
        });
      }
    },
    []
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current || !textRef.current || !containerRef.current) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = textRef.current.offsetLeft;
    const startTop = textRef.current.offsetTop;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const newLeft = Math.max(
        0,
        Math.min(
          startLeft + dx,
          containerRef.current!.offsetWidth - textRef.current!.offsetWidth
        )
      );
      const newTop = Math.max(
        0,
        Math.min(
          startTop + dy,
          containerRef.current!.offsetHeight - textRef.current!.offsetHeight
        )
      );

      setTextPosition({ x: newLeft, y: newTop });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const generatePDF = useCallback(
    async (name: string) => {
      if (!certificateImage || !imageRef.current || !textRef.current) return;

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();

      const imgBytes = await fetch(certificateImage).then((res) =>
        res.arrayBuffer()
      );
      const img = await pdfDoc.embedPng(imgBytes);

      const imgDims = img.scale(1);
      page.setSize(imgDims.width, imgDims.height);

      page.drawImage(img, {
        x: 0,
        y: 0,
        width: imgDims.width,
        height: imgDims.height,
      });

      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const [r, g, b] = fontColor
        .match(/\w\w/g)!
        .map((x) => parseInt(x, 16) / 255);

      const scaleFactor = imgDims.width / imageRef.current.offsetWidth;
      const adjustedX = textPosition.x * scaleFactor;
      const adjustedY =
        imgDims.height -
        (textPosition.y + textRef.current.offsetHeight) * scaleFactor;

      page.drawText(name, {
        x: adjustedX,
        y: adjustedY,
        size: fontSize * scaleFactor,
        font: font,
        color: rgb(r, g, b),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${name}_certificate.pdf`;
      link.click();
    },
    [certificateImage, textPosition, fontSize, fontColor]
  );

  const generateAllPDFs = useCallback(async () => {
    setGenerating(true);
    setProgress(0);
    for (let i = 0; i < names.length; i++) {
      await generatePDF(names[i]);
      setProgress(((i + 1) / names.length) * 100);
    }
    setGenerating(false);
  }, [names, generatePDF]);

  const handleNameSelect = useCallback((value: string) => {
    setSelectedName(value);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Certificate Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="certificate-image">
                Upload Certificate Image:
              </Label>
              <Input
                id="certificate-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <Label htmlFor="csv-names">Upload CSV of Names:</Label>
              <Input
                id="csv-names"
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
              />
            </div>
            <div>
              <Label htmlFor="font-size">Font Size:</Label>
              <Input
                id="font-size"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="font-color">Font Color:</Label>
              <Input
                id="font-color"
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
              />
            </div>
          </div>

          {names.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">
                Generate Certificates
              </h2>
              <Select onValueChange={handleNameSelect} value={selectedName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a name" />
                </SelectTrigger>
                <SelectContent>
                  {names.map((name, index) => (
                    <SelectItem key={index} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => generatePDF(selectedName)}
                disabled={!selectedName}
                className="mt-2 mr-2"
              >
                Generate Selected PDF
              </Button>
              <Button
                onClick={generateAllPDFs}
                disabled={generating}
                className="mt-2"
              >
                Generate All PDFs
              </Button>
              {generating && (
                <div className="mt-2">
                  <progress value={progress} max="100" className="w-full" />
                  <p>{Math.round(progress)}% complete</p>
                </div>
              )}
            </div>
          )}

          {certificateImage && (
            <div
              ref={containerRef}
              className="mt-4 relative border border-gray-300"
            >
              <img
                ref={imageRef}
                src={certificateImage}
                alt="Certificate"
                className="w-full h-auto"
              />
              <div
                ref={textRef}
                className="absolute cursor-move bg-white border border-dashed border-black bg-opacity-70 p-2 rounded"
                style={{
                  left: textPosition.x,
                  top: textPosition.y,
                  fontSize: `${fontSize}px`,
                  color: fontColor,
                }}
                onMouseDown={handleMouseDown}
              >
                {selectedName || "Preview Name"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

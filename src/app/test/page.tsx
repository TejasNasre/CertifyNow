"use client";

import React, { useState, useCallback, useRef } from "react";
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
import Image from "next/image";

interface TextPosition {
  x: number;
  y: number;
  value: string;
  columnIndex: number;
}

export default function CertificateEditor() {
  const [certificateImage, setCertificateImage] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [textPositions, setTextPositions] = useState<TextPosition[]>([]);
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState("#000000");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement>(null);
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
            setCsvData(data);
            setSelectedRow(1); // Select the first data row by default
            // Initialize text positions for each column
            setTextPositions(
              data[0].map((header, index) => ({
                x: 50 + index * 100,
                y: 50,
                value: header,
                columnIndex: index,
              }))
            );
          },
        });
      }
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, index: number) => {
      if (!containerRef.current) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = textPositions[index].x;
      const startTop = textPositions[index].y;

      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const newLeft = Math.max(
          0,
          Math.min(startLeft + dx, containerRef.current!.offsetWidth)
        );
        const newTop = Math.max(
          0,
          Math.min(startTop + dy, containerRef.current!.offsetHeight)
        );

        setTextPositions((prev) =>
          prev.map((pos, i) =>
            i === index ? { ...pos, x: newLeft, y: newTop } : pos
          )
        );
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [textPositions]
  );

  //   const generatePDF = useCallback(
  //     async (rowIndex: number) => {
  //       if (!certificateImage || !imageRef.current) return;

  //       const pdfDoc = await PDFDocument.create();
  //       const page = pdfDoc.addPage();

  //       const imgBytes = await fetch(certificateImage).then((res) =>
  //         res.arrayBuffer()
  //       );
  //       const img = await pdfDoc.embedPng(imgBytes);

  //       const imgDims = img.scale(1);
  //       page.setSize(imgDims.width, imgDims.height);

  //       page.drawImage(img, {
  //         x: 0,
  //         y: 0,
  //         width: imgDims.width,
  //         height: imgDims.height,
  //       });

  //       const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  //       const [r, g, b] = fontColor
  //         .match(/\w\w/g)!
  //         .map((x) => parseInt(x, 16) / 255);

  //       const scaleFactor = imgDims.width / imageRef.current.offsetWidth;

  //       textPositions.forEach((position) => {
  //         const adjustedX = position.x * scaleFactor;
  //         const adjustedY = imgDims.height - position.y * scaleFactor;
  //         const text = csvData[rowIndex][position.columnIndex] || "";

  //         page.drawText(text, {
  //           x: adjustedX,
  //           y: adjustedY,
  //           size: fontSize * scaleFactor,
  //           font: font,
  //           color: rgb(r, g, b),
  //         });
  //       });

  //       const pdfBytes = await pdfDoc.save();
  //       const blob = new Blob([pdfBytes], { type: "application/pdf" });
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = `certificate_${rowIndex}.pdf`;
  //       link.click();
  //     },
  //     [certificateImage, textPositions, fontSize, fontColor, csvData]
  //   );

  const generatePDF = useCallback(
    async (rowIndex: number) => {
      if (!certificateImage || !imageRef.current) return;

      const pdfDoc = await PDFDocument.create();

      // Fetch the image and get its dimensions
      const imgBytes = await fetch(certificateImage).then((res) =>
        res.arrayBuffer()
      );
      const img = await pdfDoc.embedPng(imgBytes);
      const imgDims = img.scale(1);

      // Set page size to the exact image size
      const page = pdfDoc.addPage([imgDims.width, imgDims.height]);

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

      // Calculate scale factor to match the image rendered in the browser
      const scaleFactor = imgDims.width / imageRef.current.offsetWidth;

      // Adjust positions based on scale factor
      textPositions.forEach((position) => {
        const adjustedX = position.x * scaleFactor;
        const adjustedY = imgDims.height - position.y * scaleFactor; // Invert y-axis for PDF

        const text = csvData[rowIndex][position.columnIndex] || "";

        page.drawText(text, {
          x: adjustedX,
          y: adjustedY,
          size: fontSize * scaleFactor,
          font: font,
          color: rgb(r, g, b),
        });
      });

      // Save the PDF and trigger the download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `certificate_${rowIndex}.pdf`;
      link.click();
    },
    [certificateImage, textPositions, fontSize, fontColor, csvData]
  );

  const generateAllPDFs = useCallback(async () => {
    setGenerating(true);
    setProgress(0);
    for (let i = 1; i < csvData.length; i++) {
      await generatePDF(i);
      setProgress((i / (csvData.length - 1)) * 100);
    }
    setGenerating(false);
  }, [csvData, generatePDF]);

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
              <Label htmlFor="csv-data">Upload CSV Data:</Label>
              <Input
                id="csv-data"
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

          {certificateImage && (
            <div
              ref={containerRef}
              className="mt-4 relative border border-gray-300"
            >
              <Image
                width={800}
                height={800}
                ref={imageRef}
                src={certificateImage}
                alt="Certificate"
                className="w-full h-auto"
              />
              {textPositions.map((position, index) => (
                <div
                  key={index}
                  className="select-none absolute cursor-move border border-dashed border-black bg-white bg-opacity-70 rounded px-2"
                  style={{
                    left: position.x,
                    top: position.y,
                    fontSize: `${fontSize}px`,
                    color: fontColor,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                >
                  {csvData[selectedRow]?.[position.columnIndex] ||
                    position.value}
                </div>
              ))}
            </div>
          )}

          {csvData.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">
                Preview and Generate
              </h2>
              <Select
                value={selectedRow.toString()}
                onValueChange={(value) => setSelectedRow(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a row to preview" />
                </SelectTrigger>
                <SelectContent>
                  {csvData.slice(1).map((row, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      Row {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => generatePDF(selectedRow)}
                disabled={!selectedRow}
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
        </CardContent>
      </Card>
    </div>
  );
}

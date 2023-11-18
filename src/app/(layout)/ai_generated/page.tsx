"use client";
import Image from "next/image";
import { memo, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const Galary = memo(({ generatedImages }: any) => {
  return (
    <div className="flex flex-wrap p-5">
      {generatedImages && generatedImages.length ? (
        generatedImages.map((img: string, index: number) => (
          <div key={index}>
            <Image src={img} alt={`image-${index}`} width={500} height={500} />
          </div>
        ))
      ) : (
        <div className="text-center w-full">No image generated!</div>
      )}
    </div>
  );
});
Galary.displayName = "Galary";

export default function Page() {
  const textInputRef: any = useRef(null);
  const toggleGroupRef: any = useRef(null);
  const [generatedImages, setGeneratedImages]: any[] = useState([]);

  const query = async (queryString: any) => {
    try {
      if (!queryString || !queryString.length) return;
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stablediffusionapi/anything-v5",
        {
          headers: {
            Authorization: "Bearer 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",
          },
          method: "POST",
          body: JSON.stringify(queryString),
        },
      );
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          "server status: " +
            response.status +
            "\n" +
            "server response:" +
            "\n" +
            responseText,
        );
      }
      const result = await response.blob();
      return result;
    } catch (error) {
      throw new Error("failed to fetch data caused by : " + error);
    }
  };

  const blobToBase64 = (blob: any) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const generateArt = () => {
    console.log(toggleGroupRef);
    query(textInputRef?.current?.value || "").then((response) => {
      if (response)
        blobToBase64(response).then((res: any) => {
          setGeneratedImages((pre: any) => [...pre, res]);
          console.log(generatedImages);
        });
    });
  };

  return (
    <ScrollArea className="h-[90vh] w-full rounded-md border">
      <div className="flex flex-col gap-5 p-5 h-full">
        <Card className="px-5">
          <h2 className="py-5 text-xl">Generate AI image</h2>
          <Textarea placeholder="Your sentence here..." ref={textInputRef} />
          <div className="flex gap-5 justify-between my-5 items-center">
            <div>
              <b>Categories</b>
              <ToggleGroup type="multiple" ref={toggleGroupRef}>
                <ToggleGroupItem value="realistic" aria-label="realistic">
                  <Badge>Realistic</Badge>
                </ToggleGroupItem>
                <ToggleGroupItem value="fantasy" aria-label="fantasy">
                  <Badge>Fantasy</Badge>
                </ToggleGroupItem>
                <ToggleGroupItem value="animated" aria-label="animated">
                  <Badge>Animated</Badge>
                </ToggleGroupItem>
                <ToggleGroupItem value="cartoonish" aria-label="cartoonish">
                  <Badge>Cartoonish</Badge>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Button onClick={generateArt}>Generate</Button>
          </div>
        </Card>

        <Card className="h-1/2 flex-auto">
          <h2 className="p-5 text-xl">Generated Images</h2>
          <Separator />
          <Galary generatedImages={generatedImages} />
          {generatedImages && generatedImages.length ? (
            <>
              <Separator />
              <div className="flex justify-center gap-5 m-5">
                <Button>Save to galary</Button>
                <Button>Mint NFT</Button>
              </div>
            </>
          ) : (
            <></>
          )}
        </Card>
      </div>
    </ScrollArea>
  );
}

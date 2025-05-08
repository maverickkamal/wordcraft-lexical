import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "./copy-button";

interface WordResultsProps {
  searchWord: string;
  synonyms: string[];
  antonyms: string[];
}

export function WordResults({ searchWord, synonyms, antonyms }: WordResultsProps) {
  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-center">
        Results for: <span className="text-primary">{searchWord}</span>
      </h2>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Synonyms</CardTitle>
        </CardHeader>
        <CardContent>
          {synonyms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {synonyms.map((synonym, index) => (
                <div key={index} className="flex items-center bg-secondary/50 rounded-md p-1 pr-0">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {synonym}
                  </Badge>
                  <CopyButton textToCopy={synonym} className="ml-1 h-8 w-8" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No synonyms found.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Antonyms</CardTitle>
        </CardHeader>
        <CardContent>
          {antonyms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {antonyms.map((antonym, index) => (
                <div key={index} className="flex items-center bg-secondary/50 rounded-md p-1 pr-0">
                   <Badge variant="secondary" className="text-base px-3 py-1">
                    {antonym}
                  </Badge>
                  <CopyButton textToCopy={antonym} className="ml-1 h-8 w-8" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No antonyms found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

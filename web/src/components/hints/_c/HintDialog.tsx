import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  data: Record<string, string>[];
  button: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

export default function EventDialog({ data, button, setSelected }: Props) {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const filteredData = useMemo(() => {
    const val = search.toLowerCase().trim();
    return data.filter((d) => d.name.toLowerCase().includes(val));
  }, [data, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          {button}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            {button}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." value={search} onChange={handleSearch} className="pl-10" />
          </div>

          <div className="border rounded-lg h-[60vh] overflow-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
              {filteredData.map((val) => (
                <Card
                  key={val.id}
                  className="cursor-pointer transition-all hover:scale-105 hover:shadow-md"
                  onClick={() => {
                    setSelected(val.name);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <CardContent className="p-3 flex flex-col items-center text-center">
                    <img src={val.image_url} alt={val.name} className="w-16 h-16 object-contain mb-2 rounded" />
                    <p className="text-xs font-medium leading-tight">{val.name}</p>
                    {val.rarity && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {val.rarity}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

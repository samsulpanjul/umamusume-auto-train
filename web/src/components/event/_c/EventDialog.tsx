import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  data: Record<string, string>[];
  button: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

export default function EventDialog({ data, button, setSelected }: Props) {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [iconFilter, setIconFilter] = useState<string>("ALL");

  const filteredData = useMemo(() => {
    const val = search.toLowerCase().trim();
    return data.filter((d) => {
      const nameMatch = d.name.toLowerCase().includes(val);
      const iconMatch = iconFilter === "ALL" || d.type === iconFilter;

      return nameMatch && iconMatch;
    });
  }, [data, search, iconFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const ICON_MAP: Record<string, string> = {
    SPD: "https://gametora.com/images/umamusume/icons/utx_ico_obtain_00.png",
    STA: "https://gametora.com/images/umamusume/icons/utx_ico_obtain_01.png",
    POW: "https://gametora.com/images/umamusume/icons/utx_ico_obtain_02.png",
    GUTS: "https://gametora.com/images/umamusume/icons/utx_ico_obtain_03.png",
    WIT: "https://gametora.com/images/umamusume/icons/utx_ico_obtain_04.png",
    PAL: "https://gametora.com/images/umamusume/icons/utx_ico_obtain_05.png",
    GRP: "https://gametora.com/images/umamusume/icons/utx_ico_obtain_06.png",
  };

  type SupportCardProps = {
    name: string;
    cardSrc: string;
    iconSrc?: string;   // optional
  };

  const SupportCard = ({ name, cardSrc, iconSrc }: SupportCardProps) => {
    const resolvedIcon = iconSrc ? ICON_MAP[iconSrc] : null;
    const cleanName = name.split("(")[0].trim();

    return (
      <CardContent className="p-3 flex flex-col items-center text-center">
      <div className="relative w-[110px]">
      <img src={cardSrc} alt={cleanName} className="w-full h-auto rounded-md" />

    {/* Only show icon if it exists */}
    {resolvedIcon && (
      <img
      src={resolvedIcon}
      alt=""
      className="absolute top-1 right-1 w-9 h-9"
      />
      )}
    </div>

    <div className="mt-2 text-sm font-medium">{cleanName}</div>
    </CardContent>
    );
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
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." value={search} onChange={handleSearch} className="pl-10" />
            </div>
            {button !== "Select Character" && (
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                value={iconFilter}
                onChange={(e) => setIconFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-background pl-10"
                >
                <option value="ALL">All Support Types</option>
                {Object.keys(ICON_MAP).map((key) => (
                  <option key={key} value={key}>
                  {key}
                  </option>
                  ))}
                </select>
              </div>
            )}
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
                    <SupportCard
                      name={val.name}
                      cardSrc={val.image_url}
                      iconSrc={val.type}
                    />
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

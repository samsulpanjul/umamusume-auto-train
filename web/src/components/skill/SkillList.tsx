import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useMemo, useState } from "react";

type Skill = {
  name: string;
  description: string;
};

type Props = {
  list: string[];
  addSkillList: (newList: string) => void;
  deleteSkillList: (newList: string) => void;
};

export default function SkillList({ list, addSkillList, deleteSkillList }: Props) {
  const [data, setData] = useState<Skill[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getSkillData = async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/samsulpanjul/umamusume-auto-train/refs/heads/dev/data/skills.json");
        const skills: Skill[] = await res.json();
        setData(skills);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };

    getSkillData();
  }, []);

  const filtered = useMemo(() => {
    return data.filter((skill) => skill.name.toLowerCase().includes(search.toLowerCase()) || skill.description.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <p className="text-lg font-medium mb-2">Select skill you want to buy</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="font-semibold">Open</Button>
        </DialogTrigger>
        <DialogContent className="min-h-[512px] max-w-4xl">
          <DialogHeader>
            <DialogTitle>Skills List</DialogTitle>
          </DialogHeader>

          <div className="flex gap-6 min-h-[400px]">
            {/* LEFT SIDE */}
            <div className="w-9/12 flex flex-col">
              <Input placeholder="Search..." type="search" value={search} onChange={handleSearch} />

              <div className="mt-4 grid grid-cols-2 gap-4 overflow-auto pr-2 max-h-[420px]">
                {filtered.map(
                  (skill) =>
                    !list.includes(skill.name) && (
                      <div key={skill.name} className="w-full border-2 border-border rounded-lg px-3 py-2 cursor-pointer hover:border-primary/50 transition" onClick={() => addSkillList(skill.name)}>
                        <p className="text-lg font-semibold">{skill.name}</p>
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-3/12 flex flex-col">
              <p className="font-semibold mb-2">Skills to buy</p>
              <div className="flex flex-col gap-2 overflow-auto pr-2 max-h-[420px]">
                {list.map((item) => (
                  <div key={item} className="px-4 py-2 cursor-pointer border-2 border-border rounded-lg flex justify-between items-center hover:border-destructive/50 transition" onClick={() => deleteSkillList(item)}>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

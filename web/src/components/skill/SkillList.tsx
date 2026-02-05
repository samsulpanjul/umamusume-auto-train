import { Input } from "../ui/input";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SkillData } from "@/types/skill.type";

type Props = {
  list: string[];
  addSkillList: (newList: string) => void;
  deleteSkillList: (newList: string) => void;
};

export default function SkillList({
  list,
  addSkillList,
  deleteSkillList,
}: Props) {
  const [search, setSearch] = useState("");

  const getSkillData = async () => {
    try {
      const res = await fetch("/data/skills.json");
      if (!res.ok) throw new Error("Failed to fetch skills");
      return res.json();
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  const { data } = useQuery<SkillData[]>({
    queryKey: ["skills"],
    queryFn: getSkillData,
    staleTime: 10 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    return data?.filter(
      (skill) =>
        skill.name.toLowerCase().includes(search.toLowerCase()) ||
        skill.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <p className="text-lg font-medium mb-2">Select skills you want to buy</p>

          <div className="flex gap-6 min-h-[400px]">
            {/* LEFT SIDE */}
            <div className="w-9/12 flex flex-col">
              <Input
                placeholder="Search..."
                type="search"
                value={search}
                onChange={handleSearch}
              />

              <div className="mt-4 grid grid-cols-2 gap-4 overflow-auto pr-2 max-h-[calc(80vh-11rem)]">
                {filtered?.map(
                  (skill) =>
                    !list.includes(skill.name) && (
                      <div
                        key={skill.name}
                        className="w-full border-2 border-border rounded-lg px-3 py-2 cursor-pointer hover:border-primary/50 transition"
                        onClick={() => addSkillList(skill.name)}
                      >
                        <p className="text-lg font-semibold">{skill.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {skill.description}
                        </p>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-3/12 flex flex-col">
              <p className="font-semibold mb-2">Skills to buy</p>
              <div className="flex flex-col gap-2 overflow-auto pr-2 max-h-[calc(80vh-11rem)]">
                {list.map((item) => (
                  <div
                    key={item}
                    className="px-4 py-2 cursor-pointer border-2 border-border rounded-lg flex justify-between items-center hover:border-destructive/50 transition"
                    onClick={() => deleteSkillList(item)}
                  >
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

    </>
  );
}

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FunctionModUmaCard() {
  return (
    <div style={{ "aspect-ratio": '1 / 1', width: '100%'}} className="p-5">
      <Button style={{ width:'100%', height:'100%', borderRadius: '50%' }} variant="outline">
        <Plus />
      </Button>
    </div>
  );
}

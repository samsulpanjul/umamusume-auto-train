import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarRange } from "lucide-react";
import SkeletonLayout from "./_c/Layout";
import FormTargetStat from "./_c/target-stat/Form.TargetStat";
import ListTargetStat from "./_c/target-stat/List.TargetStat";
import FormStatWeight from "./_c/stat-weight/Form.StatWeight";
import ListStatWeight from "./_c/stat-weight/List.StatWeight";
import FormTemplate from "./_c/template/Form.Template";
import ListTemplate from "./_c/template/List.Template";
import TemplateList from "./timeline/TemplateList";
import type { Config, UpdateConfigType } from "@/types";
import FormRiskTaking from "./_c/risk-taking/Form.RiskTaking";
import ListRiskTaking from "./_c/risk-taking/List.RiskTaking";
import FormActionSequence from "./_c/action-sequence/Form.ActionSequence";
import ListActionSequence from "./_c/action-sequence/List.ActionSequence";
import Timeline from "./timeline/Timeline";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function TimelineSection({ config, updateConfig }: Props) {
  return (
    <>
      <div className="section-card">
        <h2 className="text-3xl font-semibold flex items-center gap-3">
          <CalendarRange className="text-primary" />
          Timeline
        </h2>

        <Timeline config={config} updateConfig={updateConfig} />

        <TemplateList config={config} updateConfig={updateConfig} />
      </div>

      <Tabs defaultValue="action_sequence">

        <TabsList>
          <TabsTrigger value="action_sequence">Action Sequence</TabsTrigger>
          <TabsTrigger value="risk_taking">Risk Taking</TabsTrigger>
          <TabsTrigger value="stat_weight">Stat Weight</TabsTrigger>
          <TabsTrigger value="target_stat">Target Stat</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
        </TabsList>
        <TabsContent value="action_sequence">
          <SkeletonLayout>
            <SkeletonLayout.Column>
              <h2 className="text-2xl font-semibold">Action Sequence</h2>
              <FormActionSequence config={config} updateConfig={updateConfig} />
            </SkeletonLayout.Column>
            <SkeletonLayout.Column>
              <ListActionSequence config={config} updateConfig={updateConfig} />
            </SkeletonLayout.Column>
          </SkeletonLayout>
        </TabsContent>
        <TabsContent value="risk_taking">
          <SkeletonLayout>
            <SkeletonLayout.Column>
              <h2 className="text-2xl font-semibold">Risk Taking</h2>
              <FormRiskTaking config={config} updateConfig={updateConfig} />
            </SkeletonLayout.Column>
            <SkeletonLayout.Column>
              <ListRiskTaking config={config} updateConfig={updateConfig} />
            </SkeletonLayout.Column>
          </SkeletonLayout>
        </TabsContent>
        <TabsContent value="stat_weight">
          <SkeletonLayout>
            <SkeletonLayout.Column>
              <h2 className="text-2xl font-semibold">Stat Weight</h2>
              <FormStatWeight config={config} updateConfig={updateConfig} />
            </SkeletonLayout.Column>
            <SkeletonLayout.Column>
              <ListStatWeight config={config} updateConfig={updateConfig} />
            </SkeletonLayout.Column>
          </SkeletonLayout>
        </TabsContent>
        <TabsContent value="target_stat">
          <SkeletonLayout>
            <SkeletonLayout.Column>
              <h2 className="text-2xl font-semibold">Target Stat</h2>
              <FormTargetStat updateConfig={updateConfig} config={config} />
            </SkeletonLayout.Column>
            <SkeletonLayout.Column>
              <ListTargetStat config={config} updateConfig={updateConfig} />
            </SkeletonLayout.Column>
          </SkeletonLayout>
        </TabsContent>

        <TabsContent value="template">
          <SkeletonLayout>
            <SkeletonLayout.Column>
              <h2 className="text-2xl font-semibold">Template</h2>
              <FormTemplate config={config} updateConfig={updateConfig} />
            </SkeletonLayout.Column>
            <SkeletonLayout.Column>
              <ListTemplate config={config} updateConfig={updateConfig} />
            </SkeletonLayout.Column>
          </SkeletonLayout>
        </TabsContent>
      </Tabs>

    </>
  );
}

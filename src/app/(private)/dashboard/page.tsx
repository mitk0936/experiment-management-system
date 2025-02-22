import { PageContainer as ExperimentsPageContainer } from "@/presentation/modules/experiments/components/PageContainer";

export const metadata = {
  title: "Experiments | Dashboard",
  description: "Manage and analyze scientific experiments.",
};

export default function Dashboard() {
  return <ExperimentsPageContainer />;
}

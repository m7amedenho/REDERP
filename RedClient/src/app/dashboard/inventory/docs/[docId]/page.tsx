import DocDetailsClient from "./ui";

type Params = Promise<{ docId: string }>;

export default async function DocDetailsPage(props: { params: Params }) {
  const { docId } = await props.params;
  return <DocDetailsClient docId={docId} />;
}

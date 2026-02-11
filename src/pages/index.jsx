import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center flex-col">
        <h1 className="text-4xl font-bold mb-4">HALOOOO QUIZ</h1>
        <Button onClick={() => (window.location.href = "/login")}>Login</Button>
      </div>
    </>
  );
}

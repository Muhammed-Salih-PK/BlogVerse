import Hero from "@/app/components/home/Hero";

export default function HomeLayout({ children }) {
  return (
    <>
      <Hero />
      <div >
        {children}
      </div>
    </>
  );
}

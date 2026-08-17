import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: vendorData } = user
    ? await supabase
        .from("vendors")
        .select("id, business_name")
        .eq("vendor_id", user.id)
        .maybeSingle()
    : { data: null };
  return (
    <>
      <Header user={user} vendorData={vendorData} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

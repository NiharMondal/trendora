import Container from "@/shared/components/container";
import AuthNavbar from "@/features/auth/components/auth-navbar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <AuthNavbar />
            <main id="main-content" tabIndex={-1} className="outline-none">
                <Container>{children}</Container>
            </main>
        </section>
    );
}

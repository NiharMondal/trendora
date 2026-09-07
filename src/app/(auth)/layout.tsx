import Container from "@/shared/components/container";
import AuthNavbar from "@/components/layout/auth/auth-navbar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <AuthNavbar />
            <Container>{children}</Container>
        </section>
    );
}

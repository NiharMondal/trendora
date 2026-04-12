import Container from "@/components/common/shared/container";
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

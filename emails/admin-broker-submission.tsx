import { Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text, Tailwind } from "@react-email/components"
import type { Brokers } from "~/.generated/prisma/client"
import { siteConfig } from "~/config/site"
import { env } from "~/env"

interface EmailAdminBrokerSubmissionProps {
  to: string
  broker: Brokers
}

export const EmailAdminBrokerSubmission = ({ to, broker }: EmailAdminBrokerSubmissionProps) => {
  const previewText = `New Broker Submission: ${broker.broker_name}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`${env.NEXT_PUBLIC_SITE_URL}/favicon.png`}
                width="40"
                height="40"
                alt={siteConfig.name}
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              New Broker Submitted
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello Admin,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              A new broker has been submitted by <strong>{broker.submitterName || "Anonymous"}</strong> ({broker.submitterEmail || "N/A"}).
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Details:</strong><br />
              Name: {broker.broker_name}<br />
              Website: <Link href={broker.broker_website || broker.url || "#"}>{broker.broker_website || broker.url || "N/A"}</Link><br />
              Description: {broker.description || "N/A"}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Please review the broker in the admin dashboard to approve or reject it.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Link
                href={`${env.NEXT_PUBLIC_SITE_URL}/admin/brokers`}
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-4 py-3"
              >
                View Brokers in Admin
              </Link>
            </Section>
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This notification was brought to you by {siteConfig.name}.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

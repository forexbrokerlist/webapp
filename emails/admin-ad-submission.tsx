import { Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text, Tailwind } from "@react-email/components"
import type { Ad } from "~/.generated/prisma/client"
import { siteConfig } from "~/config/site"
import { env } from "~/env"

interface EmailAdminAdSubmissionProps {
  to: string
  ad: Ad
}

export const EmailAdminAdSubmission = ({ to, ad }: EmailAdminAdSubmissionProps) => {
  const previewText = `New Ad Submission: ${ad.name}`

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
              New Ad Submitted
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello Admin,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              A new ad has been submitted and paid for by <strong>{ad.name}</strong> ({ad.email}).
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Details:</strong><br />
              Type: {ad.type}<br />
              Website: <Link href={ad.websiteUrl}>{ad.websiteUrl}</Link><br />
              Description: {ad.description || "N/A"}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Please review the ad in the admin dashboard to approve or reject it.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Link
                href={`${env.NEXT_PUBLIC_SITE_URL}/admin/ads`}
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-4 py-3"
              >
                View Ads in Admin
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

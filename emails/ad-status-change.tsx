import { Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text, Tailwind } from "@react-email/components"
import type { Ad } from "~/.generated/prisma/client"
import { siteConfig } from "~/config/site"
import { env } from "~/env"

interface EmailAdStatusChangeProps {
  ad: Ad
}

export const EmailAdStatusChange = ({ ad }: EmailAdStatusChangeProps) => {
  const isApproved = ad.status === "Scheduled" || ad.status === "Published"
  const statusLabel = isApproved ? "Approved" : "Rejected"
  const previewText = `Your ad "${ad.name}" has been ${statusLabel.toLowerCase()}`

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
              Ad Status Update
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Your ad <strong>{ad.name}</strong> has been <strong>{statusLabel.toLowerCase()}</strong> by our team.
            </Text>
            
            {isApproved ? (
              <Text className="text-black text-[14px] leading-[24px]">
                Your ad is now scheduled for publication. You can view your ad details at any time by visiting our site.
              </Text>
            ) : (
              <Text className="text-black text-[14px] leading-[24px]">
                Unfortunately, your ad was not approved at this time. If you have any questions, please reply to this email.
              </Text>
            )}

            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Ad Details:</strong><br />
              Type: {ad.type}<br />
              Website: <Link href={ad.websiteUrl}>{ad.websiteUrl}</Link>
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Link
                href={env.NEXT_PUBLIC_SITE_URL}
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-4 py-3"
              >
                Visit {siteConfig.name}
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

import type { PropsWithChildren } from "react"
import { Card } from "~/components/common/card"

export default function ({ children }: PropsWithChildren) {
  return (
    <>
      <div className="pt-[140px] pb-100">
        <Card hover={false} focus={false} className="max-w-xs mx-auto">
          {children}
        </Card>
      </div>
      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>
    </>
  )
}

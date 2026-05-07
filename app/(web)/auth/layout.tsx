import type { PropsWithChildren } from "react"
import { Card } from "~/components/common/card"

export default function ({ children }: PropsWithChildren) {
  return (
    <>
      <div className="pt-[140px] max-mobile:pt-100 max-mobile:pb-16 pb-100">
        {children}
      </div>
      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>
    </>
  )
}

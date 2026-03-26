import { db } from "../services/db";

async function main() {
  const sponsors = await db.sponsor.updateMany({
    where : {
        isActive : true
    },
    data : {
        isActive : false
    }
  })
  console.log("🚀 ~ main ~ sponsors:", sponsors)


}

main()

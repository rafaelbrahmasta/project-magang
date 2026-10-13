import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
const [, , name, email, password] = process.argv;
if (!name || !email || !password) {
    console.error('Pemakaian: npx tsx src/scripts/create-admin.ts "Nama" login password');
    process.exit(1);
}
const hashed = await bcrypt.hash(password, 10);
const user = await prisma.user.upsert({
    where: { email },
    update: { name, password: hashed },
    create: { name, email, password: hashed, role: "SUPER_ADMIN" },
});
console.log(`Admin siap: ${user.email} (id ${user.id})`);
await prisma.$disconnect();
process.exit(0);
//# sourceMappingURL=create-admin.js.map
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1️⃣ Find the Existing Account
    let account = await prisma.account.findFirst({
        where: { email: "user@example.com" },
        include: { profile: true, modules: true }
    });

    if (!account) {
        // If no account exists, create a new one
        account = await prisma.account.create({
            data: {
                email: "user@example.com",
                username: "lloyd123",
                password: "securepassword",
                createdAt: new Date(),
                updatedAt: new Date(),
                profile: {
                    create: {
                        lastName: "Turqueza",
                        middleName: "M.",
                        firstName: "JhonLloyd",
                        suffix: "Jr.",
                        bio: "A passionate developer.",
                        picture: "https://example.com/profile.jpg",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                }
            },
            include: { profile: true }
        });
        console.log("✅ Created New Account with Profile:", account);
    } else {
        console.log("✅ Existing Account Found:", account);

        // 2️⃣ Update Profile Name if needed
        if (account.profile && account.profile.firstName !== "JhonLloyd") {
            await prisma.profile.update({
                where: { id: account.profile.id },
                data: {
                    lastName: "Turqueza",
                    middleName: "none",
                    firstName: "JhonLloyd",
                    suffix: "Jr.",
                    bio: "A passionate developer.",
                    picture: "https://example.com/profile.jpg",
                    updatedAt: new Date()
                }
            });
            console.log("✅ Updated Profile Info");
        }
    }

        // 3️⃣ Prevent Duplicate Modules
        const existingModuleCodes = account.modules ? account.modules.map(m => m.moduleCode) : [];

        if (!existingModuleCodes.includes("MOD001")) {
            await prisma.module.create({
                data: {
                    accountCode: "ACCT001",
                    moduleCode: "MOD001",
                    moduleDetails: "Intro to Programming",
                    moduleDesc: "This module covers the basics of programming.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    accountId: account.id
                }
            });
            console.log("✅ Added Module 1");
        }
    
        if (!existingModuleCodes.includes("MOD002")) {
            await prisma.module.create({
                data: {
                    accountCode: "ACCT001",
                    moduleCode: "MOD002",
                    moduleDetails: "Advanced Algorithms",
                    moduleDesc: "This module focuses on advanced algorithm design.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    accountId: account.id
                }
            });
            console.log("✅ Added Module 2");
        }
    
    // 4️⃣ Retrieve Updated Account Data
    const updatedAccount = await prisma.account.findFirst({
        where: { email: "user@example.com" },
        include: { profile: true, modules: true }
    });

    console.log("✅ Account with Updated Profile and Modules:", updatedAccount);
}

// Execute the script
main()
    .catch(e => console.error("❌ Error:", e))
    .finally(async () => {
        await prisma.$disconnect();
    });

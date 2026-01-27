export const MOCK_USER = {
    name: "Julian Sterling",
    email: "julian.sterling@example.com",
    subscription: "elite",
    tier: "Diamond Member",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzzErkT86nqv_f2bkbt7UaC8pvSC8SPTV1J0DOaMDywdtpSD_qxfJ40z1LzHGswUiw0mtVo5WHkiW3heennVAEFwJcTYzIESHfYIs7WWIrfyYkEHJTqEi22eguVwTiwIHBuJzHTWPaRtLVksQItV6zRRnbjTEBAb1j1qUzlq3lkSkCk2SXOzf6QjhTO6_Xx_do3Fg74bBP8Q5NSqNffvjv7222M1pNk5J4v9gPKjR4oPvliTFWBjOvJNVGYou23K3vYAtZgIBe1sE"
};

export const MOCK_CHAT_ROOMS = [
    {
        id: 1,
        name: "Premier League Live",
        description: "Live Match Chat",
        members: 2400,
        online: 852,
        type: "public",
        icon: "sports_soccer",
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDszh6tkClUpEQidqwKcTsOzmTBoX20yonA9BSOB0ozDnicxAnE7FzprBmNn6pwBbzr4468ix_AMZadq8X85UbltEoXKOp1-DeiOQP_l7VR87dTtjIP7ifQIEIQAjFGiEsNkjU7YO3rKmzZ2wD5_d5GsTK4LyrpyhkUL41N_J7-BXCduHmXBHlxIXMmRHyyzvO2Z5xYVx9KKftGhuVWrhOzbswabXfEYJQUoYL-cJShwZ_yHB4L3fVkFI1EC9cIY5xgKZV8hDKoDVA"
    },
    {
        id: 2,
        name: "La Liga Discussion",
        description: "Transfers & News",
        members: 1100,
        online: 420,
        type: "public",
        icon: "stadium",
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiX4FZHkXtmCkG90mXg0MAhjUtbw58Ad7_RpXBgjx1S3XPZnIr6n-2f4VzPNzZhu5F5C-x5Wj3THVdGbO7toQutD0OxLWZKSaK4B30oIbV3139HTNvBY9QhGcAgqOwoWjK6FgUNURydr9uvYsVxDL-BQ0_5uvLZExaZeeDnJ8LqxhoYRujZ6vZRGW46lgfDPDqLnQGcLFEqJCDtK8vqzm14AOpEazqGbb9r2gSD30gvChAa7Od6BYnsJKx9e5qje7GAyhHJMFASeM"
    },
    {
        id: 3,
        name: "Elite Pro Predictions",
        description: "AI Insights • Expert Analysis",
        members: 500,
        online: 120,
        type: "premium",
        icon: "lock",
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCq0hwLMkgByNc70Mt2yKJecp_o38xzcZemQi2b1DcH4NVXCQv2_cWVREaLzAYexNYLd6MneNeAxW50MurnlvjUFlzjBLiMj0M7Yz_YJzlPw_J0M5uflGiQzITMwh9LlYoXnHM48umxC9d45cr5sFntDbGGSEmCYIMIwtbLhdB0Dso8ux5h2R8ba7pxSgG9ZUvI1ccRqRdFlDVIdjcr3RSxWuBqTXg7mclZ27Ue6kT4Oqvye99uoipwSgNH4LX-3TM5YilgUc-KZec"
    }
];

export const MOCK_SUBSCRIPTION_PLANS = [
    {
        id: 'free',
        name: 'Free Starter',
        price: 0,
        period: 'mo',
        features: [
            'Basic Match Stats',
            'Public Chat Rooms',
            'Daily Free Pick',
            'Live Score Updates',
        ],
        popular: false,
        gradient: false,
    },
    {
        id: 'pro',
        name: 'Pro Analyst',
        price: 9.99,
        period: 'mo',
        features: [
            'Advanced xG Models',
            'Ad-Free Experience',
            '5 AI Predictions/Day',
            'Player Heatmaps',
            'Injury Reports',
        ],
        popular: true,
        gradient: false,
    },
    {
        id: 'elite',
        name: 'Elite Gold',
        price: 24.99,
        period: 'mo',
        features: [
            'Unlimited AI Agent',
            'VIP Chat Access',
            'Real-Time Algo Picks',
            'Betting Strategy Calls',
            'Exclusive Merchandise',
            'Priority Support',
        ],
        popular: false,
        gradient: true,
    },
];

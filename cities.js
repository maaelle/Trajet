
export const citiesList = [
    {city: 'paris', score: 2000, distance:{
            lyon:466,
            marseille:773,
            bordeaux:583,
            valence:563,
            brest:591
        }},
    {city: 'lyon', score: 1000, distance:{
            paris:466,
            marseille:315,
            bordeaux:556,
            valence:103,
            brest:971
        }},
    {city: 'marseille', score: 600, distance:{
            paris:773,
            lyon: 315,
            bordeaux:645,
            valence:214,
            brest:1280
        }},
    {city: 'bordeaux', score: 300, distance:{
            paris:583,
            lyon:556,
            marseille:645,
            valence:652,
            brest:652
        }},
    {city: 'valence', score: 500, distance:{
            paris:563,
            lyon:103,
            marseille:214,
            bordeaux:652,
            brest:1068
        }},
    {city: 'brest', score: 100, distance:{
            paris:591,
            lyon:971,
            marseille:1280,
            bordeaux:652,
            valence:1068
        }}
];
db.getCollection("users").aggregate(

    // Pipeline
    [
        // Stage 1
        {
            $lookup: // Equality Match
            {
                from: "likes",
                localField: "_id",
                foreignField: "user",
                as: "likes"
            }
            
            // Uncorrelated Subqueries
            // (supported as of MongoDB 3.6)
            // {
            //    from: "<collection to join>",
            //    let: { <var_1>: <expression>, …, <var_n>: <expression> },
            //    pipeline: [ <pipeline to execute on the collection to join> ],
            //    as: "<output array field>"
            // }
            
            // Correlated Subqueries
            // (supported as of MongoDB 5.0)
            // {
            //    from: "<foreign collection>",
            //    localField: "<field from local collection's documents>",
            //    foreignField: "<field from foreign collection's documents>",
            //    let: { <var_1>: <expression>, …, <var_n>: <expression> },
            //    pipeline: [ <pipeline to run> ],
            //    as: "<output array field>"
            // }
        },

        // Stage 2
        {
            $lookup: // Equality Match
            {
                from: "playedsongs",
                localField: "_id",
                foreignField: "user",
                as: "playedsongs"
            }
            
            // Uncorrelated Subqueries
            // (supported as of MongoDB 3.6)
            // {
            //    from: "<collection to join>",
            //    let: { <var_1>: <expression>, …, <var_n>: <expression> },
            //    pipeline: [ <pipeline to execute on the collection to join> ],
            //    as: "<output array field>"
            // }
            
            // Correlated Subqueries
            // (supported as of MongoDB 5.0)
            // {
            //    from: "<foreign collection>",
            //    localField: "<field from local collection's documents>",
            //    foreignField: "<field from foreign collection's documents>",
            //    let: { <var_1>: <expression>, …, <var_n>: <expression> },
            //    pipeline: [ <pipeline to run> ],
            //    as: "<output array field>"
            // }
        },

        // Stage 3
        {
            $lookup: // Equality Match
            {
                from: "playlists",
                localField: "_id",
                foreignField: "user",
                as: "playlists"
            }
            
            // Uncorrelated Subqueries
            // (supported as of MongoDB 3.6)
            // {
            //    from: "<collection to join>",
            //    let: { <var_1>: <expression>, …, <var_n>: <expression> },
            //    pipeline: [ <pipeline to execute on the collection to join> ],
            //    as: "<output array field>"
            // }
            
            // Correlated Subqueries
            // (supported as of MongoDB 5.0)
            // {
            //    from: "<foreign collection>",
            //    localField: "<field from local collection's documents>",
            //    foreignField: "<field from foreign collection's documents>",
            //    let: { <var_1>: <expression>, …, <var_n>: <expression> },
            //    pipeline: [ <pipeline to run> ],
            //    as: "<output array field>"
            // }
        }
    ],

    // Options
    {

    }

    // Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
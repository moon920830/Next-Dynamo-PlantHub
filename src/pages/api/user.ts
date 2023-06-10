import {getUser} from "../../utils/dynamodb"
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.query)
    console.log(req.method)
    const method = req.method
    const email =req.query.email as string
    switch(method){
      case "GET":
        const user = await getUser(email)
        const parsedPlants = await JSON.parse(user.plants)
        user.plants = parsedPlants
        if(user?.password?.length) user.password = true
        return res.status(200).json(user)
      default:
        console.log("YOU HIT A POST REQUEST")
        console.log(req.body)
        const body = JSON.parse(req.body)
        console.log(body)
        const plants= body.plants
        console.log(plants)
        //I need to be sure to stringify the plants whenever I'm done with the app, and upload images only plants with the tag new, then reintegrate them back to the array

        //Later when I add image upload change, if they change the image, I'll have to be sure to upload to S3 as well in that scenario
        res.status(400).json("HIT")

    }
  }
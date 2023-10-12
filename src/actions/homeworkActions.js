
import PenguinHomework from "@/models/PenguinHomework";
import { dynamicBlurDataUrl } from "@/utils/dynamicBlurDataUrl";
import connect from "@/utils/db";

connect();

export async function getAllHomeworks(searchParams) {
  console.log('getAllPhotos - searchParams', searchParams);

  try {
    const sort = '-_id';
    const limit = 10;
    const next = searchParams?.next || null;

    console.log('getAllPhotos - next', next);

    const homeworks = await PenguinHomework.find({
      _id: next
        ? sort === '_id'
          ? { $gt: next } : { $lt: next }
        : { $exists: true } 
    }).limit(limit).sort(sort)

  
    const next_cursor = homeworks[limit - 1]?._id.toString() || undefined; 

    console.log('getAllHomeworks - ==> next_cursor', next_cursor);

    const blurDataPromise = homeworks.map(photo => dynamicBlurDataUrl(photo.imgUrl));
    const blurData = await Promise.all(blurDataPromise);

    const hmData = homeworks.map((hm, index) => ({
      ...hm._doc,
      blurHash: blurData[index]
    }))

    console.log('getAllHomeworks ==> data: ', data);
    return { homeworkData: JSON.stringify(hmData), next_cursor };
  } catch (error) {
    return { errMsg: error.message }
  }
}
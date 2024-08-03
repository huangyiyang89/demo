/**
 * 将数组转换为字符串
 * 这个函数接受一个数组作为参数，并将其转换为字符串
 * @param array - 要转换的数组
 * @returns 返回转换后的字符串
 */
export const arrayToString = (array) => {
  try {
    return JSON.stringify(array);
  } catch (error) {
    console.error('Error converting array to string:', error);
    return '[]';
  }
};

export const stringToArray = (string) => {
  try {
    return JSON.parse(string);
  } catch (error) {
    console.error('Error converting string to array:', error);
    return [];
  }
};


/**
 * 将坐标字符串转换为多边形点的数组，并根据给定的比例因子进行缩放
 *
 * @param {String} coordString - 以逗号分隔的坐标字符串，格式为"[x1,y1,x2,y2,...]"
 * @param {Number} [scale=1] - 缩放比例因子，默认为1
 * @return {Array<Array<Number>>} 缩放后的多边形点的二维数组
 * @throws {Error} 如果输入的坐标字符串格式不正确，将抛出错误
 */
export const stringToPoints = (coordString,scale=1) => {
  
  if (!coordString) {
    return [];
  }
  const coords = JSON.parse(coordString);
  const coordArray = [];
  for (let i = 0; i < coords.length; i += 2) {
    const x = parseInt(coords[i], 10)*scale;
    const y = parseInt(coords[i + 1], 10)*scale;
    coordArray.push({ x, y });
  }
  return coordArray;
};

/**
 * 将坐标点数组转换为字符串格式
 * @param {Array<Array<Number>>} points - 一个二维数组，其中每个子数组表示一个坐标点的[x, y]坐标
 * @return {String} 格式化后的字符串，其中每个坐标点的格式为"x,y"，所有坐标对都用逗号分隔，并被括号包围
 */
export const pointsToString = (points) => {
  let coordString = points.map((point) => point.x + "," + point.y).join(",");
  return "["+coordString+"]"
};



// 转换时间戳为可读时间
export const localtime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};



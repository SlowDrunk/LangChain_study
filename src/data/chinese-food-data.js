/**
 * 中国各省份特色美食数据
 * 用于向量存储和RAG检索的示例数据
 */
export const chineseFoodData = [
  {
    province: "四川省",
    foods: [
      {
        name: "麻婆豆腐",
        description: "四川传统名菜，以豆腐和牛肉末为主料，配以辣椒、花椒等调料，麻辣鲜香。"
      },
      {
        name: "宫保鸡丁",
        description: "四川经典菜肴，鸡肉丁配花生米，酸甜微辣，口感丰富。"
      },
      {
        name: "火锅",
        description: "四川最具代表性的美食，麻辣鲜香，可选择各种食材涮煮。"
      },
      {
        name: "回锅肉",
        description: "四川家常菜，五花肉先煮后炒，配以蒜苗，香而不腻。"
      }
    ]
  },
  {
    province: "广东省",
    foods: [
      {
        name: "白切鸡",
        description: "广东经典名菜，鸡肉原汁原味，配姜葱汁，清淡鲜美。"
      },
      {
        name: "叉烧包",
        description: "广式点心，外皮松软，内馅香甜，是茶楼的经典点心。"
      },
      {
        name: "肠粉",
        description: "广东传统小吃，米浆蒸制，配以各种馅料和酱汁，滑嫩爽口。"
      },
      {
        name: "煲仔饭",
        description: "广东特色饭食，米饭与食材同煲，底部有焦香锅巴。"
      }
    ]
  },
  {
    province: "湖南省",
    foods: [
      {
        name: "剁椒鱼头",
        description: "湖南名菜，鱼头配以剁椒蒸制，鲜辣开胃，香气四溢。"
      },
      {
        name: "臭豆腐",
        description: "湖南特色小吃，外酥内嫩，闻起来臭吃起来香。"
      },
      {
        name: "口味虾",
        description: "湖南夜市经典，小龙虾配以各种香料，麻辣鲜香。"
      },
      {
        name: "糖油粑粑",
        description: "湖南传统小吃，糯米制成，外脆内软，甜而不腻。"
      }
    ]
  },
  {
    province: "山东省",
    foods: [
      {
        name: "糖醋里脊",
        description: "山东经典菜，里脊肉炸制后裹糖醋汁，酸甜可口。"
      },
      {
        name: "德州扒鸡",
        description: "山东名菜，整鸡扒制，肉质鲜嫩，香味浓郁。"
      },
      {
        name: "煎饼",
        description: "山东传统主食，薄如纸，可配各种菜肴，口感香脆。"
      },
      {
        name: "鲁菜",
        description: "山东菜系，以清淡、鲜嫩、香醇著称，注重火候。"
      }
    ]
  },
  {
    province: "江苏省",
    foods: [
      {
        name: "盐水鸭",
        description: "南京名菜，鸭肉鲜嫩，盐水腌制，清淡鲜美。"
      },
      {
        name: "阳春面",
        description: "江苏传统面食，汤清面滑，配以葱花和香油，简单美味。"
      },
      {
        name: "小笼包",
        description: "江苏特色点心，皮薄馅多，汤汁丰富，鲜香可口。"
      },
      {
        name: "红烧肉",
        description: "江苏家常菜，五花肉红烧，色泽红亮，肥而不腻。"
      }
    ]
  },
  {
    province: "浙江省",
    foods: [
      {
        name: "西湖醋鱼",
        description: "杭州名菜，草鱼配糖醋汁，酸甜适口，肉质鲜嫩。"
      },
      {
        name: "东坡肉",
        description: "浙江名菜，五花肉慢炖，色泽红亮，入口即化。"
      },
      {
        name: "龙井虾仁",
        description: "杭州特色，虾仁配龙井茶叶，清香淡雅，鲜嫩爽口。"
      },
      {
        name: "叫花鸡",
        description: "浙江名菜，整鸡包裹荷叶和黄泥烤制，香味独特。"
      }
    ]
  },
  {
    province: "陕西省",
    foods: [
      {
        name: "肉夹馍",
        description: "陕西特色小吃，烤馍夹入炖肉，外脆内香，回味无穷。"
      },
      {
        name: "羊肉泡馍",
        description: "西安名吃，羊肉汤配掰碎的烤馍，汤浓肉烂，香气扑鼻。"
      },
      {
        name: "凉皮",
        description: "陕西传统小吃，米面制成，配以各种调料，爽滑筋道。"
      },
      {
        name: "臊子面",
        description: "陕西特色面食，面条配臊子，酸辣开胃，营养丰富。"
      }
    ]
  },
  {
    province: "云南省",
    foods: [
      {
        name: "过桥米线",
        description: "云南名吃，热汤配生食材，现场烫制，汤鲜味美。"
      },
      {
        name: "汽锅鸡",
        description: "云南特色，整鸡用汽锅蒸制，原汁原味，汤清肉嫩。"
      },
      {
        name: "菌菇火锅",
        description: "云南特色火锅，以各种野生菌为主，鲜香可口，营养丰富。"
      },
      {
        name: "鲜花饼",
        description: "云南传统点心，以鲜花为馅，外皮酥脆，花香四溢。"
      }
    ]
  }
];

/**
 * 将数据转换为文本格式，用于向量存储
 */
export function convertToTextDocuments() {
  const documents = [];
  
  chineseFoodData.forEach((item) => {
    item.foods.forEach((food) => {
      documents.push({
        pageContent: `${item.province}的特色美食：${food.name}。${food.description}`,
        metadata: {
          province: item.province,
          foodName: food.name
        }
      });
    });
  });
  
  return documents;
}


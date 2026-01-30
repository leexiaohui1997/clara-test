export interface Option {
  key: string;
  value: string;
}

export interface Question {
  id: number;
  type: 'single' | 'boolean' | 'multiple';
  question: string;
  options: Option[];
  answer: string[]; // Always array for consistency, e.g. ['A'], ['A', 'B']
  score: number;
}

export const questions: Question[] = [
  // --- 单选题 ---
  {
    id: 1,
    type: 'single',
    question: '独奏类演职人员的建议到场时间是？',
    options: [
      { key: 'A', value: '早上 11:00' },
      { key: 'B', value: '中午 12:45' },
      { key: 'C', value: '下午 1:15' },
      { key: 'D', value: '下午 2:00' },
    ],
    answer: ['B'],
    score: 4,
  },
  {
    id: 2,
    type: 'single',
    question: '纯观众和有演出任务的人员，座位安排分别是？',
    options: [
      { key: 'A', value: '大家都随便坐' },
      { key: 'B', value: '有演出任务的坐前排，纯观众坐后排' },
      { key: 'C', value: '纯观众坐前排，有演出任务的坐后排' },
      { key: 'D', value: '先到先得' },
    ],
    answer: ['C'],
    score: 4,
  },
  {
    id: 3,
    type: 'single',
    question: '如果活动当天迟到了，正确的做法是？',
    options: [
      { key: 'A', value: '既然迟到了就不去了' },
      { key: 'B', value: '到了立刻推门进去找座位' },
      { key: 'C', value: '在门口等待中场休息' },
      { key: 'D', value: '私信告知组织者，并在当前节目结束后再进场，不要在别人表演时突然进入' },
    ],
    answer: ['D'],
    score: 4,
  },
  {
    id: 4,
    type: 'single',
    question: '上半场演出结束，大家去拍合影的时间大概是？',
    options: [
      { key: 'A', value: '2:00' },
      { key: 'B', value: '3:15' },
      { key: 'C', value: '4:20' },
      { key: 'D', value: '6:00' },
    ],
    answer: ['B'],
    score: 4,
  },
  {
    id: 5,
    type: 'single',
    question: '下午茶 & 沙龙时间是哪个时间段？',
    options: [
      { key: 'A', value: '1:45 - 2:00' },
      { key: 'B', value: '2:00 - 3:15' },
      { key: 'C', value: '3:15 - 4:20' },
      { key: 'D', value: '4:20 - 6:00' },
    ],
    answer: ['C'],
    score: 4,
  },
  {
    id: 6,
    type: 'single',
    question: '关于食物和饮料，以下哪项规定是正确的？',
    options: [
      { key: 'A', value: '可以带进琴房，但不能带进音乐厅' },
      { key: 'B', value: '可以带进音乐厅，只要不洒出来就行' },
      { key: 'C', value: '所有的食物饮料只能在咖啡店食用，严禁带入音乐厅和琴房' },
      { key: 'D', value: '可以在钢琴旁边吃东西' },
    ],
    answer: ['C'],
    score: 4,
  },
  {
    id: 7,
    type: 'single',
    question: '关于钢琴的使用，以下说法错误的是？',
    options: [
      { key: 'A', value: '只能使用提供给我们的四台钢琴' },
      { key: 'B', value: '音乐厅其他楼层（一楼、二楼、三楼）的钢琴如果空着，也可以去弹' },
      { key: 'C', value: '钢琴是轮流玩的，不要单个人占用太久' },
      { key: 'D', value: '严禁把食物、饮料、水、乐器放在钢琴上' },
    ],
    answer: ['B'],
    score: 4,
  },
  {
    id: 8,
    type: 'single',
    question: '在他人表演时，观众应该注意什么？',
    options: [
      { key: 'A', value: '可以小声交流讨论剧情' },
      { key: 'B', value: '拿出手机录像并大声喝彩' },
      { key: 'C', value: '保持安静，手机静音，不说话，不哼唱' },
      { key: 'D', value: '可以吃零食' },
    ],
    answer: ['C'],
    score: 4,
  },
  {
    id: 9,
    type: 'single',
    question: '如果违反了上述规定（如擅自使用其他钢琴、带食物进场等），将面临什么后果？',
    options: [
      { key: 'A', value: '罚款 100 元' },
      { key: 'B', value: '被要求当众表演节目' },
      { key: 'C', value: '踢出活动，踢出乐团' },
      { key: 'D', value: '负责打扫全场卫生' },
    ],
    answer: ['C'],
    score: 4,
  },
  {
    id: 10,
    type: 'single',
    question: '整个活动的结束时间预计是？',
    options: [
      { key: 'A', value: '4:20' },
      { key: 'B', value: '5:00' },
      { key: 'C', value: '6:00' },
      { key: 'D', value: '7:00' },
    ],
    answer: ['C'],
    score: 4,
  },

  // --- 判断型选择题 ---
  {
    id: 11,
    type: 'boolean',
    question: '主持人和合奏类演职人员早上 11 点过台，由于时间较早，中午建议回家休息。',
    options: [
      { key: 'A', value: '正确' },
      { key: 'B', value: '错误' },
    ],
    answer: ['B'],
    score: 4,
  },
  {
    id: 12,
    type: 'boolean',
    question: '观众应在 1:15 开始进场，务必在 1:45 前全部入座完毕。',
    options: [
      { key: 'A', value: '正确' },
      { key: 'B', value: '错误' },
    ],
    answer: ['A'],
    score: 4,
  },
  {
    id: 13,
    type: 'boolean',
    question: '如果迟到了，为了不影响他人，应该直接推门进去并迅速找个角落坐下。',
    options: [
      { key: 'A', value: '正确' },
      { key: 'B', value: '错误' },
    ],
    answer: ['B'],
    score: 4,
  },
  {
    id: 14,
    type: 'boolean',
    question: '活动现场除了提供给我们的四台钢琴外，严禁擅自使用音乐厅一楼、二楼或三楼的其他钢琴。',
    options: [
      { key: 'A', value: '正确' },
      { key: 'B', value: '错误' },
    ],
    answer: ['A'],
    score: 4,
  },
  {
    id: 15,
    type: 'boolean',
    question: '活动全程禁止吸烟。',
    options: [
      { key: 'A', value: '正确' },
      { key: 'B', value: '错误' },
    ],
    answer: ['A'],
    score: 4,
  },

  // --- 多选题 ---
  {
    id: 16,
    type: 'multiple',
    question: '关于活动结束后的安排 (6点散场后)，以下描述正确的是？',
    options: [
      { key: 'A', value: '所有人必须立即离开' },
      { key: 'B', value: '留一部分男生打扫卫生' },
      { key: 'C', value: '要吃年夜饭的出发去饭店' },
      { key: 'D', value: '大家原地解散回家' },
    ],
    answer: ['B', 'C'],
    score: 8,
  },
  {
    id: 17,
    type: 'multiple',
    question: '以下哪些行为在活动中是严令禁止的？',
    options: [
      { key: 'A', value: '在音乐厅内吃东西或喝饮料' },
      { key: 'B', value: '在别人表演时说话或哼唱' },
      { key: 'C', value: '擅自使用非指定区域的钢琴' },
      { key: 'D', value: '将水杯或乐器放在钢琴上' },
    ],
    answer: ['A', 'B', 'C', 'D'],
    score: 8,
  },
  {
    id: 18,
    type: 'multiple',
    question: '关于下午茶和沙龙时间 (3:15-4:20)，大家的安排包括？',
    options: [
      { key: 'A', value: '一起出发去旁边的音乐厅拍合影' },
      { key: 'B', value: '在咖啡店享用下午茶' },
      { key: 'C', value: '进行沙龙交流' },
      { key: 'D', value: '在音乐厅内进行下半场演出' },
    ],
    answer: ['A', 'B', 'C'],
    score: 8,
  },
  {
    id: 19,
    type: 'multiple',
    question: '对于有演出任务的人员 (包括主持人、独奏、合奏)，以下要求正确的是？',
    options: [
      { key: 'A', value: '坐在后排' },
      { key: 'B', value: '独奏人员 12:45 过台' },
      { key: 'C', value: '主持人及合奏人员 11:00 过台' },
      { key: 'D', value: '必须坐在前排' },
    ],
    answer: ['A', 'B', 'C'],
    score: 8,
  },
  {
    id: 20,
    type: 'multiple',
    question: '为保护钢琴，以下哪些做法是正确的？',
    options: [
      { key: 'A', value: '只能使用指定的四台钢琴' },
      { key: 'B', value: '轮流使用，单人不要占用太久' },
      { key: 'C', value: '不把食物饮料放在钢琴上' },
      { key: 'D', value: '小心使用，避免磕碰' },
    ],
    answer: ['A', 'B', 'C', 'D'],
    score: 8,
  },
];

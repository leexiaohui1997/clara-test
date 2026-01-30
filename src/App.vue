<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { questions, type Question } from "./data/questions";

type ViewState = "home" | "quiz" | "result" | "analysis";

const currentView = ref<ViewState>("home");
const currentQuestionIndex = ref(0);
const userAnswers = reactive<Record<number, string[]>>({});

// Navigation
const startQuiz = () => {
  currentView.value = "quiz";
  currentQuestionIndex.value = 0;
  // Reset answers
  for (const key in userAnswers) {
    delete userAnswers[key];
  }
};

const retakeQuiz = () => {
  startQuiz();
};

const viewAnalysis = () => {
  currentView.value = "analysis";
};

const goHome = () => {
  currentView.value = "home";
};

// Quiz Logic
const currentQuestion = computed(() => questions[currentQuestionIndex.value]!);
const progress = computed(() =>
  Math.round(((currentQuestionIndex.value + 1) / questions.length) * 100),
);

const isLastQuestion = computed(
  () => currentQuestionIndex.value === questions.length - 1,
);

const handleOptionChange = (
  key: string,
  type: "single" | "boolean" | "multiple",
) => {
  const qId = currentQuestion.value!.id;
  if (type === "single" || type === "boolean") {
    userAnswers[qId] = [key];
  } else {
    // Multiple choice toggle
    const current = userAnswers[qId] || [];
    if (current.includes(key)) {
      userAnswers[qId] = current.filter((k) => k !== key);
    } else {
      userAnswers[qId] = [...current, key];
    }
  }
};

const isOptionSelected = (key: string) => {
  const qId = currentQuestion.value.id;
  return userAnswers[qId]?.includes(key);
};

const nextQuestion = () => {
  if (isLastQuestion.value) {
    currentView.value = "result";
  } else {
    currentQuestionIndex.value++;
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

// Scoring
const totalScore = computed(() => {
  let score = 0;
  questions.forEach((q) => {
    const uAnswer = userAnswers[q.id] || [];
    const cAnswer = q.answer;

    // Strict equality check
    if (
      uAnswer.length === cAnswer.length &&
      uAnswer.every((a) => cAnswer.includes(a))
    ) {
      score += q.score;
    }
  });
  return score;
});

// Analysis Helpers
const getQuestionStatus = (q: Question) => {
  const uAnswer = userAnswers[q.id] || [];
  const cAnswer = q.answer;
  const isCorrect =
    uAnswer.length === cAnswer.length &&
    uAnswer.every((a) => cAnswer.includes(a));
  return isCorrect ? "correct" : "incorrect";
};

const getOptionClass = (q: Question, key: string) => {
  const uAnswer = userAnswers[q.id] || [];
  const cAnswer = q.answer;
  const isSelected = uAnswer.includes(key);
  const isCorrect = cAnswer.includes(key);

  if (isCorrect) return "option-correct";
  if (isSelected && !isCorrect) return "option-wrong";
  return "";
};
</script>

<template>
  <div class="app-container">
    <!-- HOME VIEW -->
    <div v-if="currentView === 'home'" class="view home-view">
      <div class="card home-card">
        <h1 class="title">克拉拉新年音乐会<br />活动注意事项测评考试</h1>
        <div class="info">
          <p>共 {{ questions.length }} 道题</p>
          <p>满分 100 分</p>
        </div>
        <button class="btn btn-primary btn-lg" @click="startQuiz">
          开始答题
        </button>
      </div>
    </div>

    <!-- QUIZ VIEW -->
    <div v-else-if="currentView === 'quiz'" class="view quiz-view">
      <div class="header">
        <div class="progress-info">
          <span
            >进度 {{ currentQuestionIndex + 1 }} / {{ questions.length }}</span
          >
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <div class="card question-card">
        <div class="question-type">
          {{
            currentQuestion.type === "single"
              ? "单选题"
              : currentQuestion.type === "boolean"
                ? "判断题"
                : "多选题"
          }}
          （{{ currentQuestion.score }}分）
        </div>
        <h2 class="question-text">
          {{ currentQuestion.id }}. {{ currentQuestion.question }}
        </h2>

        <div class="options-list">
          <div
            v-for="opt in currentQuestion.options"
            :key="opt.key"
            class="option-item"
            :class="{ selected: isOptionSelected(opt.key) }"
            @click="handleOptionChange(opt.key, currentQuestion.type)"
          >
            <div class="option-marker">{{ opt.key }}</div>
            <div class="option-content">{{ opt.value }}</div>
            <div class="option-check" v-if="isOptionSelected(opt.key)">✓</div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button
          class="btn btn-secondary"
          @click="prevQuestion"
          :disabled="currentQuestionIndex === 0"
        >
          上一题
        </button>
        <button class="btn btn-primary" @click="nextQuestion">
          {{ isLastQuestion ? "提交试卷" : "下一题" }}
        </button>
      </div>
    </div>

    <!-- RESULT VIEW -->
    <div v-else-if="currentView === 'result'" class="view result-view">
      <div class="card result-card">
        <h2 class="result-title">考试结束</h2>
        <div class="score-circle">
          <span class="score-val">{{ totalScore }}</span>
          <span class="score-label">分</span>
        </div>
        <div class="result-actions">
          <button class="btn btn-primary btn-block" @click="retakeQuiz">
            重新测试
          </button>
          <button class="btn btn-outline btn-block" @click="viewAnalysis">
            查看解析
          </button>
        </div>
      </div>
    </div>

    <!-- ANALYSIS VIEW -->
    <div v-else-if="currentView === 'analysis'" class="view analysis-view">
      <div class="header sticky-header">
        <h2>答案解析</h2>
        <div class="score-mini">得分: {{ totalScore }}</div>
        <button class="btn btn-small" @click="goHome">返回首页</button>
      </div>

      <div class="analysis-list">
        <div
          v-for="q in questions"
          :key="q.id"
          class="card analysis-card"
          :class="getQuestionStatus(q)"
        >
          <div class="analysis-q-header">
            <span class="q-id">{{ q.id }}.</span>
            <span class="q-type"
              >[{{
                q.type === "single"
                  ? "单选"
                  : q.type === "boolean"
                    ? "判断"
                    : "多选"
              }}]</span
            >
            <span class="q-status">{{
              getQuestionStatus(q) === "correct" ? "正确" : "错误"
            }}</span>
          </div>
          <div class="q-text">{{ q.question }}</div>

          <div class="analysis-options">
            <div
              v-for="opt in q.options"
              :key="opt.key"
              class="analysis-option"
              :class="getOptionClass(q, opt.key)"
            >
              <span class="opt-key">{{ opt.key }}.</span>
              <span class="opt-val">{{ opt.value }}</span>
              <span v-if="q.answer.includes(opt.key)" class="icon-correct"
                >✅</span
              >
              <span
                v-else-if="userAnswers[q.id]?.includes(opt.key)"
                class="icon-wrong"
                >❌</span
              >
            </div>
          </div>

          <div class="correct-answer-display">
            正确答案：{{ q.answer.join(", ") }}
          </div>
        </div>
      </div>

      <div class="footer-actions">
        <button class="btn btn-primary btn-block" @click="retakeQuiz">
          重新测试
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* GLOBAL LAYOUT */
.app-container {
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  display: flex;
  flex-direction: column;
}

.view {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* CARDS */
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

/* BUTTONS */
.btn {
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary {
  background-color: #4a90e2;
  color: white;
}
.btn-primary:active {
  background-color: #357abd;
}
.btn-secondary {
  background-color: #e0e6ed;
  color: #555;
}
.btn-outline {
  background-color: transparent;
  border: 2px solid #4a90e2;
  color: #4a90e2;
}
.btn-lg {
  font-size: 18px;
  padding: 16px 32px;
}
.btn-block {
  width: 100%;
  margin-bottom: 12px;
}
.btn-small {
  padding: 6px 12px;
  font-size: 14px;
}

/* HOME VIEW */
.home-view {
  justify-content: center;
}
.home-card {
  text-align: center;
  padding: 40px 20px;
}
.title {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 30px;
  line-height: 1.4;
  word-break: break-word;
}
.info {
  margin-bottom: 40px;
  color: #666;
}

/* QUIZ VIEW */
.header {
  margin-bottom: 20px;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}
.progress-bar {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background-color: #4a90e2;
  transition: width 0.3s ease;
}

.question-type {
  display: inline-block;
  background-color: #f0f4f8;
  color: #4a90e2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 12px;
}
.question-text {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 24px;
  line-height: 1.5;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid #eee;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.option-item.selected {
  border-color: #4a90e2;
  background-color: #f0f7ff;
}
.option-marker {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #eee;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 12px;
  font-weight: bold;
}
.option-item.selected .option-marker {
  background-color: #4a90e2;
  color: white;
}
.option-content {
  flex: 1;
  font-size: 16px;
  color: #333;
}
.option-check {
  color: #4a90e2;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

/* RESULT VIEW */
.result-view {
  justify-content: center;
}
.result-card {
  text-align: center;
}
.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 8px solid #4a90e2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px auto;
  color: #4a90e2;
}
.score-val {
  font-size: 48px;
  font-weight: bold;
}
.score-label {
  font-size: 16px;
}

/* ANALYSIS VIEW */
.analysis-view {
  padding-top: 0;
}
.sticky-header {
  position: sticky;
  top: 0;
  background: #f5f7fa;
  padding: 20px 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sticky-header h2 {
  margin: 0;
  font-size: 18px;
}
.score-mini {
  font-weight: bold;
  color: #4a90e2;
}

.analysis-card {
  border-left: 4px solid transparent;
}
.analysis-card.correct {
  border-left-color: #4caf50;
}
.analysis-card.incorrect {
  border-left-color: #f44336;
}

.analysis-q-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}
.q-id {
  margin-right: 8px;
  font-weight: bold;
}
.q-type {
  margin-right: auto;
}
.q-status {
  font-weight: bold;
}
.correct .q-status {
  color: #4caf50;
}
.incorrect .q-status {
  color: #f44336;
}

.q-text {
  font-weight: bold;
  margin-bottom: 16px;
}

.analysis-option {
  display: flex;
  align-items: flex-start;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 14px;
}
.option-correct {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
}
.option-wrong {
  background-color: rgba(244, 67, 54, 0.1);
  color: #c62828;
}
.opt-key {
  margin-right: 8px;
  font-weight: bold;
  min-width: 20px;
}
.opt-val {
  flex: 1;
}

.correct-answer-display {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
  padding-top: 12px;
  border-top: 1px dashed #eee;
}

.footer-actions {
  padding: 20px 0;
}
</style>

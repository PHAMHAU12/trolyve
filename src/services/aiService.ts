import { MathProblemResponse } from '../data/sampleProblems';

export const AI_MODELS = [
  {
    id: 'gemini-3-flash-preview',
    name: 'gemini-3-flash-preview',
    title: 'Gemini 3 Flash Preview',
    description: 'Tốc độ cực nhanh, phản hồi tức thì, tối ưu phân tích hình học (Mặc định)',
    tag: 'Mặc định',
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'gemini-3-pro-preview',
    title: 'Gemini 3 Pro Preview',
    description: 'Mô hình suy luận chuyên sâu, giải quyết các bài toán không gian phức tạp',
    tag: 'Dự phòng 1',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'gemini-2.5-flash',
    title: 'Gemini 2.5 Flash',
    description: 'Model ổn định cao, tiết kiệm hạn mức quota API hàng ngày',
    tag: 'Dự phòng 2',
  },
];

export const SYSTEM_PROMPT = `Bạn là TRỢ LÝ VẼ HÌNH _ PHẠM HẬU - Chuyên gia AI chuyên phân tích đề toán và vẽ hình học chuẩn mực, chính xác tuyệt đối theo chuẩn Sách Giáo Khoa Toán học Việt Nam (Kết nối tri thức, Cánh diều, Chân trời sáng tạo).

NHIỆM VỤ CỐT LÕI:
Khi nhận được đề bài toán (văn bản hoặc ảnh OCR), hãy phân tích bóc tách các yếu tố hình học và tính toán tọa độ để dựng hình vẽ ĐẸP, CHUẨN LOGIC, CHÍNH XÁC, ĐẶT TÊN CÁC ĐỈNH ĐÚNG NGUYÊN VĂN THEO ĐỀ BÀI ĐÃ NẠP.

QUY TẮC BẢO TOÀN VÀ ĐẶT TÊN ĐỈNH (VERTEX NAMING):
1. BẮT BUỘC giữ nguyên ký hiệu đỉnh theo đề bài đã nạp:
   - Nếu đề bài cho hình lăng trụ hoặc hình hộp ABCD.A'B'C'D':
     + 8 đỉnh BẮT BUỘC có id là: "A", "B", "C", "D", "A'", "B'", "C'", "D'".
     + TUYỆT ĐỐI KHÔNG tự ý đổi thành "E", "F", "G", "H" hay "A1", "B1", "C1", "D1", hay "A_1". Phải giữ đúng dấu phẩy nháy đơn "'".
     + Đáy dưới là đa giác ABCD (y = 0), gán role: "base".
     + Đáy trên là đa giác A'B'C'D' (y = h > 0, x_A' = x_A, z_A' = z_A...), gán role: "top_base".
     + Các cạnh bên nối đúng từng cặp đỉnh tương ứng: AA', BB', CC', DD'.
   - Nếu đề bài cho hình lăng trụ tam giác ABC.A'B'C':
     + 6 đỉnh BẮT BUỘC có id là: "A", "B", "C", "A'", "B'", "C'".
     + Đáy dưới ABC (role: "base"), đáy trên A'B'C' (role: "top_base"). Cạnh bên: AA', BB', CC'.
   - Nếu đề bài sử dụng ký hiệu khác (như ABCD.A1B1C1D1 hoặc MNPQ.M'N'P'Q'): dùng đúng nguyên văn ký hiệu đó.
   - Nếu là hình chóp S.ABCD: đỉnh chóp là "S", đáy là "A", "B", "C", "D".

QUY TẮC DỰNG HÌNH LĂNG TRỤ & HÌNH HỘP CHUẨN SGK VIỆT NAM:
1. Tọa độ chuẩn SGK cho hình hộp / lăng trụ tứ giác ABCD.A'B'C'D' (hình cân đối, không trùng mép, thẩm mỹ cao):
   - Mặt phẳng đáy dưới y = 0 là hình bình hành phối cảnh chuẩn SGK:
     + A(-2.0, 0, -1.2): Đỉnh khuất bên trong, phía sau bên trái.
     + B(-1.0, 0, 1.2): Đỉnh phía trước bên trái.
     + C(2.5, 0, 1.2): Đỉnh phía trước bên phải.
     + D(1.5, 0, -1.2): Đỉnh phía sau bên phải.
     (Vector AB = DC = (1.0, 0, 2.4), đáy là hình bình hành chuẩn 100%).
   - Mặt phẳng đáy trên y = 3.2 (chiều cao h = 3.2): Tịnh tiến thẳng đứng từ đáy dưới:
     + A'(-2.0, 3.2, -1.2)
     + B'(-1.0, 3.2, 1.2)
     + C'(2.5, 3.2, 1.2)
     + D'(1.5, 3.2, -1.2)
   - Nếu là lăng trụ xiên: đáy trên được tịnh tiến theo vector xiên (ví dụ dX = 0.8, dZ = 0.4).

2. Tọa độ chuẩn SGK cho hình lăng trụ tam giác ABC.A'B'C':
   - Đáy dưới y = 0: A(-1.8, 0, -0.8), B(0.0, 0, 1.2), C(2.2, 0, -0.6)
   - Đáy trên y = 3.2: A'(-1.8, 3.2, -0.8), B'(0.0, 3.2, 1.2), C'(2.2, 3.2, -0.6)

3. Quy ước Nét đứt (dashed = true) & Nét liền (dashed = false) chuẩn SGK:
   - Với hình hộp / lăng trụ tứ giác ABCD.A'B'C'D':
     + Đỉnh A nằm ở góc trong cùng che khuất: Đúng 3 cạnh xuất phát từ A là NÉT ĐỨT (dashed: true):
       * Cạnh bên: AA' (dashed: true, category: "lateral")
       * Cạnh đáy dưới: AB (dashed: true, category: "base")
       * Cạnh đáy dưới: AD (dashed: true, category: "base")
     + TẤT CẢ 9 CẠNH CÒN LẠI ĐỀU LÀ NÉT LIỀN (dashed: false):
       * Cạnh đáy dưới: BC, CD (dashed: false, category: "base")
       * Cạnh đáy trên: A'B', B'C', C'D', D'A' (dashed: false, category: "base")
       * Cạnh bên: BB', CC', DD' (dashed: false, category: "lateral")
     + Tổng cộng có đúng 12 cạnh khung lăng trụ (3 nét đứt, 9 nét liền).
   - Với hình lăng trụ tam giác ABC.A'B'C':
     + Cạnh đáy dưới AC nằm phía sau bị che khuất: AC (dashed: true, category: "base").
     + 8 cạnh còn lại là NÉT LIỀN: AB, BC, A'B', B'C', C'A', AA', BB', CC' (dashed: false).
     + Tổng cộng có đúng 9 cạnh khung lăng trụ (1 nét đứt, 8 nét liền).

4. Quy ước tạo mặt (faces):
   - Các đỉnh trong danh sách vertexIds của mỗi mặt PHẢI LIỆT KÊ THEO THỨ TỰ VÒNG TRÒN CHU VI (cyclic order) để mặt không bị vặn xoắn:
     + Đáy dưới: ["A", "B", "C", "D"]
     + Đáy trên: ["A'", "B'", "C'", "D'"]
     + Mặt bên ABB'A': ["A", "B", "B'", "A'"]
     + Mặt bên BCC'B': ["B", "C", "C'", "B'"]
     + Mặt bên CDD'C': ["C", "D", "D'", "C'"]
     + Mặt bên DAA'D': ["D", "A", "A'", "D'"]

QUY TẮC DỰNG HÌNH CHÓP (S.ABCD, S.ABC...):
- Đáy y = 0. Đỉnh S có y = h > 0.
- Nếu SA vuông góc đáy: x_S = x_A, z_S = z_A, y_S = h. Cạnh SA nét đứt nếu A ở góc trong.
- Nếu chóp đều: S nằm thẳng đứng trên tâm đáy O(0, 0, 0).
- Cạnh đáy khuất vẽ nét đứt (thường là AD đối với S.ABCD, hoặc AC đối với S.ABC).

THIẾT DIỆN & MẶT CẮT:
- Tính toán tọa độ chính xác các giao điểm (M, N, P, Q...).
- Cạnh thiết diện nào đi trong khối hoặc bị che khuất thì dashed = true. Cạnh nhìn thấy thì dashed = false.
- category: "cross_section".

MÃ SVG VÀ GEOGEBRA:
- Mã SVG (viewBox="0 0 500 400") phải vẽ sắc nét hình lăng trụ/hình chóp với đầy đủ nét đứt, nét liền và nhãn đỉnh chính xác (như A, B, C, D, A', B', C', D').
- Mã GeoGebra script đầy đủ các lệnh tạo điểm, đoạn thẳng, đa giác.

BẠN BẮT BUỘC TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON THEO CẤU TRÚC ĐƯỢC YÊU CẦU.`;

const JSON_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Tên bài toán / Tóm tắt hình vẽ' },
    chapterTag: { type: 'string', description: 'Chương mục SGK' },
    analysis: {
      type: 'object',
      properties: {
        entities: { type: 'array', items: { type: 'string' } },
        geometricRelations: { type: 'array', items: { type: 'string' } },
        problemSummary: { type: 'string' },
      },
      required: ['entities', 'geometricRelations', 'problemSummary'],
    },
    modelType: { type: 'string', description: '"geometry_3d" hoặc "algebra_2d"' },
    model3D: {
      type: 'object',
      properties: {
        vertices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              x: { type: 'number' },
              y: { type: 'number' },
              z: { type: 'number' },
              role: { type: 'string' },
            },
            required: ['id', 'x', 'y', 'z'],
          },
        },
        edges: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              from: { type: 'string' },
              to: { type: 'string' },
              dashed: { type: 'boolean' },
              category: { type: 'string' },
            },
            required: ['from', 'to', 'dashed'],
          },
        },
        faces: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              vertexIds: { type: 'array', items: { type: 'string' } },
              color: { type: 'string' },
              opacity: { type: 'number' },
            },
            required: ['name', 'vertexIds'],
          },
        },
        crossSection: {
          type: 'object',
          properties: {
            planeName: { type: 'string' },
            polygonVertexIds: { type: 'array', items: { type: 'string' } },
            description: { type: 'string' },
            sliderParam: { type: 'string' },
            minVal: { type: 'number' },
            maxVal: { type: 'number' },
            defaultVal: { type: 'number' },
          },
        },
        arAnchorPoints: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['vertices', 'edges'],
    },
    algebra2D: {
      type: 'object',
      properties: {
        functionExpression: { type: 'string' },
        parameterName: { type: 'string' },
        minParam: { type: 'number' },
        maxParam: { type: 'number' },
        defaultParam: { type: 'number' },
        extremaDescription: { type: 'string' },
        tableOfVariations: { type: 'string' },
      },
    },
    pedagogicalScript: {
      type: 'object',
      properties: {
        steps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              stepNumber: { type: 'integer' },
              title: { type: 'string' },
              description: { type: 'string' },
              highlightElementIds: { type: 'array', items: { type: 'string' } },
              teacherQuestion: { type: 'string' },
            },
            required: ['stepNumber', 'title', 'description', 'teacherQuestion'],
          },
        },
        keyTeachingGoal: { type: 'string' },
      },
      required: ['steps', 'keyTeachingGoal'],
    },
    exportData: {
      type: 'object',
      properties: {
        latexExercise: { type: 'string' },
        svgCode: { type: 'string' },
        geogebraScript: { type: 'string' },
        arPreviewNotes: { type: 'string' },
      },
      required: ['latexExercise', 'svgCode', 'geogebraScript'],
    },
    teacherNotes: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['title', 'chapterTag', 'analysis', 'modelType', 'exportData'],
};

export interface SolveMathRequest {
  prompt?: string;
  imageBase64?: string;
  imageMime?: string;
  apiKey?: string;
  preferredModel?: string;
  onStatusUpdate?: (status: string, modelName: string) => void;
  onStepUpdate?: (step: number, status: 'processing' | 'success' | 'error', errorMsg?: string) => void;
}

export async function solveMathProblem({
  prompt,
  imageBase64,
  imageMime,
  apiKey: explicitApiKey,
  preferredModel,
  onStatusUpdate,
  onStepUpdate,
}: SolveMathRequest): Promise<MathProblemResponse> {
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
  const activeApiKey = explicitApiKey || storedKey || '';

  if (!activeApiKey) {
    throw new Error('Chưa cấu hình GEMINI_API_KEY. Vui lòng nhập API Key để sử dụng ứng dụng.');
  }

  // Fallback sequence according to AI_INSTRUCTIONS.md:
  // 1. gemini-3-flash-preview (Default)
  // 2. gemini-3-pro-preview
  // 3. gemini-2.5-flash
  // 4. Extended fallbacks: gemini-2.0-flash, gemini-1.5-flash
  const baseOrder = [
    preferredModel || 'gemini-3-flash-preview',
    'gemini-3-pro-preview',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ];

  const modelList = baseOrder.filter((m, i, arr) => arr.indexOf(m) === i);
  let lastErrorMsg = '';

  for (let i = 0; i < modelList.length; i++) {
    const currentModel = modelList[i];
    const isRetry = i > 0;

    const statusText = isRetry
      ? `Model ${modelList[i - 1]} gặp sự cố (${lastErrorMsg.slice(0, 45)}...). Đang tự động chuyển sang model dự phòng: ${currentModel}...`
      : `Đang phân tích đề bài & vẽ hình với model: ${currentModel}...`;

    onStatusUpdate?.(statusText, currentModel);
    onStepUpdate?.(1, 'processing');

    try {
      // 1. Try server endpoint first
      let data: MathProblemResponse | null = null;
      try {
        const serverRes = await fetch('/api/solve-math', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gemini-key': activeApiKey,
          },
          body: JSON.stringify({
            prompt,
            imageBase64,
            imageMime,
            model: currentModel,
            apiKey: activeApiKey,
          }),
        });

        if (serverRes.ok) {
          data = await serverRes.json();
        } else {
          const errBody = await serverRes.json().catch(() => ({}));
          // If server returns error, save verbatim message
          if (serverRes.status !== 404) {
            lastErrorMsg = errBody.error || `HTTP ${serverRes.status}`;
          }
        }
      } catch (err: any) {
        lastErrorMsg = err.message || 'Lỗi kết nối';
      }

      // 2. If server didn't succeed, call Gemini REST API directly
      if (!data) {
        data = await callGeminiDirectly({
          apiKey: activeApiKey,
          model: currentModel,
          prompt,
          imageBase64,
          imageMime,
        });
      }

      if (data) {
        data = normalizePrismGeometry(data, prompt);
        onStepUpdate?.(1, 'success');
        onStepUpdate?.(2, 'success');
        onStepUpdate?.(3, 'success');
        return data;
      }
    } catch (modelErr: any) {
      console.warn(`Attempt with ${currentModel} failed:`, modelErr);
      lastErrorMsg = modelErr.message || String(modelErr);
      // Continue loop to retry next fallback model
    }
  }

  // If all models failed, mark steps as stopped due to error
  onStepUpdate?.(1, 'error', lastErrorMsg);
  onStepUpdate?.(2, 'error', 'Đã dừng do lỗi');
  onStepUpdate?.(3, 'error', 'Đã dừng do lỗi');

  // Show verbatim API error as requested in AI_INSTRUCTIONS.md line 31
  throw new Error(`Tất cả các model AI đều thất bại. Nguyên văn lỗi từ API: ${lastErrorMsg}`);
}

async function callGeminiDirectly({
  apiKey,
  model,
  prompt,
  imageBase64,
  imageMime,
}: {
  apiKey: string;
  model: string;
  prompt?: string;
  imageBase64?: string;
  imageMime?: string;
}): Promise<MathProblemResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const parts: any[] = [];
  if (imageBase64) {
    parts.push({
      inline_data: {
        data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
        mime_type: imageMime || 'image/jpeg',
      },
    });
  }

  const userText = prompt
    ? `Bài toán cần nạp đề và vẽ hình chuẩn SGK:\n${prompt}\n\nHãy bóc tách thực thể toán học, tính toán tọa độ 3D chuẩn xác, phân định nét liền/nét đứt, mã SVG và GeoGebra.`
    : 'Hãy nhận diện đề bài từ ảnh (OCR), bóc tách thực thể toán học, tính toán tọa độ 3D và vẽ hình chuẩn SGK.';

  parts.push({ text: userText });

  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: 'user',
        parts,
      },
    ],
    generationConfig: {
      response_mime_type: 'application/json',
      response_schema: JSON_SCHEMA,
      temperature: 0.2,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Verbatim API error extraction (e.g. 429 RESOURCE_EXHAUSTED)
    const errCode = errorData.error?.code || response.status;
    const errStatus = errorData.error?.status || '';
    const errMessage = errorData.error?.message || response.statusText;
    const verbatim = `${errCode} ${errStatus ? errStatus + ': ' : ''}${errMessage}`;
    throw new Error(verbatim);
  }

  const result = await response.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('API không trả về nội dung hợp lệ.');
  }

  const parsed = JSON.parse(rawText);
  return parsed as MathProblemResponse;
}

/**
 * Chuẩn hóa hình học và bảo toàn tên đỉnh lăng trụ / hình hộp theo đúng đề đã nạp
 * Ví dụ: ABCD.A'B'C'D' hoặc ABC.A'B'C'
 */
export function normalizePrismGeometry(data: MathProblemResponse, prompt?: string): MathProblemResponse {
  if (!data || !data.model3D || !data.model3D.vertices || data.model3D.vertices.length === 0) {
    return data;
  }

  // Chuẩn hóa dấu nháy trong đề bài (nếu người dùng gõ ’ hoặc ‘ hoặc ´ thì đổi về ')
  const normalizedPrompt = (prompt || '').replace(/[’‘´`]/g, "'");

  // Kiểm tra nhận diện lăng trụ từ đề bài:
  // Khớp dạng: ABCD.A'B'C'D', ABC.A'B'C', ABCD.A1B1C1D1, MNPQ.M'N'P'Q'...
  const prismPattern = /\b([A-Za-z]{3,4})\.([A-Za-z0-9_']{3,8})\b/;
  const prismMatch = normalizedPrompt.match(prismPattern);

  const isPrismPrompt = Boolean(
    prismMatch ||
    /lăng trụ|hình hộp|lập phương|hộp chữ nhật/i.test(normalizedPrompt) ||
    /lăng trụ|hình hộp|lập phương/i.test(data.title || '')
  );

  if (!isPrismPrompt) {
    return data;
  }

  const model = data.model3D;
  const currentVertices = [...model.vertices];

  // 1. Phân tích tên đỉnh đáy dưới & đáy trên từ đề
  let bottomIds = ['A', 'B', 'C', 'D'];
  let topIds = ["A'", "B'", "C'", "D'"];
  let isQuadPrism = true;

  if (prismMatch) {
    const bStr = prismMatch[1].toUpperCase();
    const tStr = prismMatch[2];

    if (bStr.length === 3) {
      isQuadPrism = false;
      bottomIds = bStr.split('');
      if (tStr.includes("'")) {
        topIds = bottomIds.map((id) => `${id}'`);
      } else if (/\d/.test(tStr)) {
        topIds = bottomIds.map((id) => `${id}1`);
      } else if (tStr.length === 3) {
        topIds = tStr.toUpperCase().split('');
      } else {
        topIds = bottomIds.map((id) => `${id}'`);
      }
    } else if (bStr.length === 4) {
      isQuadPrism = true;
      bottomIds = bStr.split('');
      if (tStr.includes("'")) {
        topIds = bottomIds.map((id) => `${id}'`);
      } else if (/\d/.test(tStr)) {
        topIds = bottomIds.map((id) => `${id}1`);
      } else if (tStr.length === 4) {
        topIds = tStr.toUpperCase().split('');
      } else {
        topIds = bottomIds.map((id) => `${id}'`);
      }
    }
  } else {
    // Không có tên rõ ràng thì mặc định theo số đỉnh
    if (currentVertices.length <= 7) {
      isQuadPrism = false;
      bottomIds = ['A', 'B', 'C'];
      topIds = ["A'", "B'", "C'"];
    } else {
      isQuadPrism = true;
      bottomIds = ['A', 'B', 'C', 'D'];
      topIds = ["A'", "B'", "C'", "D'"];
    }
  }

  // 2. Xây dựng bản đồ ánh xạ đỉnh (Rename map) nếu AI lỡ đổi tên
  const renameMap: Record<string, string> = {};

  // Gom các đỉnh phụ (như M, N, P, Q điểm cắt)
  const mainBottomCount = bottomIds.length;
  const mainTopCount = topIds.length;

  // Lọc tìm các đỉnh đáy dưới và đáy trên trong output của AI
  // Thông thường đáy dưới có y ≈ 0 (hoặc nhỏ hơn), đáy trên có y > 0
  const sortedByY = [...currentVertices].sort((a, b) => a.y - b.y);
  const potentialBottom = sortedByY.slice(0, mainBottomCount);
  const potentialTop = sortedByY.slice(mainBottomCount, mainBottomCount + mainTopCount);

  // Kiểm tra nếu AI trả về các tên như E, F, G, H hoặc A1, B1, C1, D1 thay vì A', B', C', D'
  currentVertices.forEach((v) => {
    // Chuẩn hóa dấu nháy
    const normId = v.id.replace(/[’‘´`]/g, "'");
    if (normId !== v.id) {
      renameMap[v.id] = normId;
    }
  });

  // Nếu topIds có dấu nháy mà trong danh sách đỉnh không có đỉnh nào chứa dấu nháy
  const hasPrimeInTop = topIds.some((id) => id.includes("'"));
  const hasPrimeInVertices = currentVertices.some((v) => v.id.includes("'"));

  if (hasPrimeInTop && !hasPrimeInVertices) {
    // AI đã đổi A'B'C'D' thành E,F,G,H hoặc A1,B1,C1,D1
    const aliasList4 = [
      ['E', 'F', 'G', 'H'],
      ['A1', 'B1', 'C1', 'D1'],
      ['A_1', 'B_1', 'C_1', 'D_1'],
      ['A2', 'B2', 'C2', 'D2'],
      ['A_', 'B_', 'C_', 'D_'],
    ];
    const aliasList3 = [
      ['D', 'E', 'F'],
      ['A1', 'B1', 'C1'],
      ['A_1', 'B_1', 'C_1'],
      ['A2', 'B2', 'C2'],
    ];
    const candidates = isQuadPrism ? aliasList4 : aliasList3;

    for (const cand of candidates) {
      const matchAll = cand.every((cId) => currentVertices.some((v) => v.id === cId));
      if (matchAll) {
        cand.forEach((cId, idx) => {
          renameMap[cId] = topIds[idx];
        });
        break;
      }
    }

    // Nếu vẫn chưa map được, map theo thứ tự các đỉnh ở tầng trên (y cao hơn)
    if (Object.keys(renameMap).length === 0 && potentialTop.length === topIds.length) {
      potentialTop.forEach((v, idx) => {
        if (!bottomIds.includes(v.id)) {
          renameMap[v.id] = topIds[idx];
        }
      });
    }
  }

  // Áp dụng renameMap cho vertices, edges, faces, crossSection, pedagogicalScript
  if (Object.keys(renameMap).length > 0) {
    model.vertices.forEach((v) => {
      if (renameMap[v.id]) {
        v.id = renameMap[v.id];
      }
    });

    model.edges.forEach((e) => {
      if (renameMap[e.from]) e.from = renameMap[e.from];
      if (renameMap[e.to]) e.to = renameMap[e.to];
    });

    if (model.faces) {
      model.faces.forEach((f) => {
        f.vertexIds = f.vertexIds.map((id) => renameMap[id] || id);
      });
    }

    if (model.crossSection?.polygonVertexIds) {
      model.crossSection.polygonVertexIds = model.crossSection.polygonVertexIds.map(
        (id) => renameMap[id] || id
      );
    }

    if (data.pedagogicalScript?.steps) {
      data.pedagogicalScript.steps.forEach((st) => {
        if (st.highlightElementIds) {
          st.highlightElementIds = st.highlightElementIds.map((id) => {
            // handle edge ids like "E-F" or vertex ids like "E"
            let mapped = id;
            Object.entries(renameMap).forEach(([oldK, newK]) => {
              mapped = mapped.replace(new RegExp(`\\b${oldK}\\b`, 'g'), newK);
            });
            return mapped;
          });
        }
      });
    }
  }

  // 3. Chuẩn hóa tọa độ 3D chuẩn SGK để hình lăng trụ hiển thị cân đối và sắc nét nhất
  if (isQuadPrism) {
    // Tọa độ chuẩn SGK cho tứ giác ABCD.A'B'C'D'
    const canonicalMap: Record<string, { x: number; y: number; z: number; role: string }> = {
      [bottomIds[0]]: { x: -2.0, y: 0.0, z: -1.2, role: 'base' },
      [bottomIds[1]]: { x: -1.0, y: 0.0, z: 1.2, role: 'base' },
      [bottomIds[2]]: { x: 2.5, y: 0.0, z: 1.2, role: 'base' },
      [bottomIds[3]]: { x: 1.5, y: 0.0, z: -1.2, role: 'base' },
      [topIds[0]]: { x: -2.0, y: 3.2, z: -1.2, role: 'top_base' },
      [topIds[1]]: { x: -1.0, y: 3.2, z: 1.2, role: 'top_base' },
      [topIds[2]]: { x: 2.5, y: 3.2, z: 1.2, role: 'top_base' },
      [topIds[3]]: { x: 1.5, y: 3.2, z: -1.2, role: 'top_base' },
    };

    // Kiểm tra xem 8 đỉnh chính có đầy đủ trong model.vertices không
    const existingIds = new Set(model.vertices.map((v) => v.id));

    // Đảm bảo 8 đỉnh chính đều có mặt
    [...bottomIds, ...topIds].forEach((id) => {
      if (!existingIds.has(id) && canonicalMap[id]) {
        model.vertices.push({
          id,
          x: canonicalMap[id].x,
          y: canonicalMap[id].y,
          z: canonicalMap[id].z,
          role: canonicalMap[id].role,
        });
      }
    });

    // Cập nhật role và điều chỉnh tọa độ nếu tọa độ hiện tại bị méo mó/phẳng bẹp
    model.vertices.forEach((v) => {
      if (canonicalMap[v.id]) {
        v.role = canonicalMap[v.id].role;
        // Nếu y của đáy trên và đáy dưới bằng nhau (hình bị bẹp) hoặc tọa độ bị lỗi NaN/0
        const isCollapsed = Math.abs(v.x) < 0.01 && Math.abs(v.y) < 0.01 && Math.abs(v.z) < 0.01;
        if (isCollapsed) {
          v.x = canonicalMap[v.id].x;
          v.y = canonicalMap[v.id].y;
          v.z = canonicalMap[v.id].z;
        }
      }
    });

    // 4. Chuẩn hóa Nét vẽ chuẩn SGK cho ABCD.A'B'C'D':
    // Quy ước: Đỉnh khuất là A (bottomIds[0]). 3 cạnh từ A là nét đứt: AA', AB, AD.
    // 9 cạnh còn lại là nét liền: BC, CD, BB', CC', DD', A'B', B'C', C'D', D'A'.
    const A = bottomIds[0];
    const B = bottomIds[1];
    const C = bottomIds[2];
    const D = bottomIds[3];
    const A_prime = topIds[0];
    const B_prime = topIds[1];
    const C_prime = topIds[2];
    const D_prime = topIds[3];

    const standardEdges = [
      // Đáy dưới
      { from: A, to: B, dashed: true, category: 'base' },
      { from: B, to: C, dashed: false, category: 'base' },
      { from: C, to: D, dashed: false, category: 'base' },
      { from: D, to: A, dashed: true, category: 'base' },
      // Đáy trên
      { from: A_prime, to: B_prime, dashed: false, category: 'base' },
      { from: B_prime, to: C_prime, dashed: false, category: 'base' },
      { from: C_prime, to: D_prime, dashed: false, category: 'base' },
      { from: D_prime, to: A_prime, dashed: false, category: 'base' },
      // Cạnh bên
      { from: A, to: A_prime, dashed: true, category: 'lateral' },
      { from: B, to: B_prime, dashed: false, category: 'lateral' },
      { from: C, to: C_prime, dashed: false, category: 'lateral' },
      { from: D, to: D_prime, dashed: false, category: 'lateral' },
    ];

    // Tạo bản đồ các cạnh chuẩn
    const stdEdgeMap = new Map<string, { dashed: boolean; category: string }>();
    standardEdges.forEach((e) => {
      const key1 = `${e.from}__${e.to}`;
      const key2 = `${e.to}__${e.from}`;
      stdEdgeMap.set(key1, { dashed: e.dashed, category: e.category });
      stdEdgeMap.set(key2, { dashed: e.dashed, category: e.category });
    });

    // Cập nhật các cạnh hiện có
    const existingEdgeKeys = new Set<string>();
    model.edges.forEach((e) => {
      const key1 = `${e.from}__${e.to}`;
      const key2 = `${e.to}__${e.from}`;
      existingEdgeKeys.add(key1);
      existingEdgeKeys.add(key2);

      const std = stdEdgeMap.get(key1);
      if (std) {
        // Áp dụng đúng quy tắc nét đứt / liền chuẩn SGK
        e.dashed = std.dashed;
        e.category = std.category;
      }
    });

    // Bổ sung các cạnh lăng trụ còn thiếu (nếu AI quên sinh cạnh nào)
    standardEdges.forEach((stdE) => {
      const key1 = `${stdE.from}__${stdE.to}`;
      if (!existingEdgeKeys.has(key1)) {
        model.edges.push({
          from: stdE.from,
          to: stdE.to,
          dashed: stdE.dashed,
          category: stdE.category,
        });
        existingEdgeKeys.add(key1);
      }
    });

    // 5. Chuẩn hóa Faces (Mặt) theo thứ tự chu vi khép kín (cyclic order)
    if (!model.faces || model.faces.length < 6) {
      model.faces = [
        { name: `Đáy dưới ${A}${B}${C}${D}`, vertexIds: [A, B, C, D], color: '#94a3b8', opacity: 0.12 },
        { name: `Đáy trên ${A_prime}${B_prime}${C_prime}${D_prime}`, vertexIds: [A_prime, B_prime, C_prime, D_prime], color: '#38bdf8', opacity: 0.16 },
        { name: `Mặt bên ${A}${B}${B_prime}${A_prime}`, vertexIds: [A, B, B_prime, A_prime], color: '#64748b', opacity: 0.08 },
        { name: `Mặt bên ${B}${C}${C_prime}${B_prime}`, vertexIds: [B, C, C_prime, B_prime], color: '#0ea5e9', opacity: 0.12 },
        { name: `Mặt bên ${C}${D}${D_prime}${C_prime}`, vertexIds: [C, D, D_prime, C_prime], color: '#0ea5e9', opacity: 0.12 },
        { name: `Mặt bên ${D}${A}${A_prime}${D_prime}`, vertexIds: [D, A, A_prime, D_prime], color: '#64748b', opacity: 0.08 },
      ];
    } else {
      // Đảm bảo thứ tự đỉnh các mặt không bị chéo
      model.faces.forEach((f) => {
        if (f.vertexIds.length === 4) {
          const ids = f.vertexIds;
          if (ids.includes(A) && ids.includes(B) && ids.includes(B_prime) && ids.includes(A_prime)) {
            f.vertexIds = [A, B, B_prime, A_prime];
          } else if (ids.includes(B) && ids.includes(C) && ids.includes(C_prime) && ids.includes(B_prime)) {
            f.vertexIds = [B, C, C_prime, B_prime];
          } else if (ids.includes(C) && ids.includes(D) && ids.includes(D_prime) && ids.includes(C_prime)) {
            f.vertexIds = [C, D, D_prime, C_prime];
          } else if (ids.includes(D) && ids.includes(A) && ids.includes(A_prime) && ids.includes(D_prime)) {
            f.vertexIds = [D, A, A_prime, D_prime];
          } else if (ids.includes(A) && ids.includes(B) && ids.includes(C) && ids.includes(D)) {
            f.vertexIds = [A, B, C, D];
          } else if (ids.includes(A_prime) && ids.includes(B_prime) && ids.includes(C_prime) && ids.includes(D_prime)) {
            f.vertexIds = [A_prime, B_prime, C_prime, D_prime];
          }
        }
      });
    }
  } else {
    // Lăng trụ tam giác ABC.A'B'C'
    const A = bottomIds[0];
    const B = bottomIds[1];
    const C = bottomIds[2];
    const A_prime = topIds[0];
    const B_prime = topIds[1];
    const C_prime = topIds[2];

    const canonicalMap3: Record<string, { x: number; y: number; z: number; role: string }> = {
      [A]: { x: -1.8, y: 0.0, z: -0.8, role: 'base' },
      [B]: { x: 0.0, y: 0.0, z: 1.2, role: 'base' },
      [C]: { x: 2.2, y: 0.0, z: -0.6, role: 'base' },
      [A_prime]: { x: -1.8, y: 3.2, z: -0.8, role: 'top_base' },
      [B_prime]: { x: 0.0, y: 3.2, z: 1.2, role: 'top_base' },
      [C_prime]: { x: 2.2, y: 3.2, z: -0.6, role: 'top_base' },
    };

    model.vertices.forEach((v) => {
      if (canonicalMap3[v.id]) {
        v.role = canonicalMap3[v.id].role;
        const isCollapsed = Math.abs(v.x) < 0.01 && Math.abs(v.y) < 0.01 && Math.abs(v.z) < 0.01;
        if (isCollapsed) {
          v.x = canonicalMap3[v.id].x;
          v.y = canonicalMap3[v.id].y;
          v.z = canonicalMap3[v.id].z;
        }
      }
    });

    // Cạnh AC nét đứt, các cạnh còn lại nét liền
    model.edges.forEach((e) => {
      if ((e.from === A && e.to === C) || (e.from === C && e.to === A)) {
        e.dashed = true;
      }
    });
  }

  return data;
}

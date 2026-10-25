import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware (allow large base64 for images/OCR)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const SYSTEM_INSTRUCTION = `Bạn là TRỢ LÝ VẼ HÌNH _ PHẠM HẬU - Chuyên gia AI chuyên phân tích đề toán và vẽ hình học chuẩn mực, chính xác tuyệt đối theo chuẩn Sách Giáo Khoa Toán học Việt Nam (Kết nối tri thức, Cánh diều, Chân trời sáng tạo).

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

// Endpoint for processing math problem
app.post('/api/solve-math', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, imageBase64, imageMime, model = 'gemini-2.5-flash', apiKey: bodyApiKey } = req.body;
    const headerApiKey = req.headers['x-gemini-key'] as string;

    if (!prompt && !imageBase64) {
      res.status(400).json({ error: 'Vui lòng cung cấp văn bản bài toán hoặc hình ảnh bài tập.' });
      return;
    }

    const apiKey = headerApiKey || bodyApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(401).json({ error: 'Chưa cấu hình GEMINI_API_KEY. Vui lòng nhập API key trên ứng dụng.' });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'tro-ly-ve-hinh-pham-hau',
        },
      },
    });

    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
          mimeType: imageMime || 'image/jpeg',
        },
      });
    }

    const userText = prompt
      ? `Bài toán cần nạp đề và vẽ hình:\n${prompt}\n\nHãy phân tích bóc tách thực thể, quan hệ toán học, tính toán tọa độ 3D chuẩn xác, phân định nét liền/nét đứt, mã SVG và GeoGebra script.`
      : 'Hãy nhận diện đề bài từ ảnh (OCR), phân tích thực thể, tính tọa độ 3D hoặc đồ thị, vẽ hình chuẩn SGK.';

    parts.push({ text: userText });

    const response = await ai.models.generateContent({
      model: model || 'gemini-2.5-flash',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Tên bài toán / Tóm tắt hình vẽ' },
            chapterTag: { type: Type.STRING, description: 'Chương mục SGK' },
            analysis: {
              type: Type.OBJECT,
              properties: {
                entities: { type: Type.ARRAY, items: { type: Type.STRING } },
                geometricRelations: { type: Type.ARRAY, items: { type: Type.STRING } },
                problemSummary: { type: Type.STRING }
              },
              required: ['entities', 'geometricRelations', 'problemSummary']
            },
            modelType: { type: Type.STRING, description: '"geometry_3d" hoặc "algebra_2d"' },
            model3D: {
              type: Type.OBJECT,
              properties: {
                vertices: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      x: { type: Type.NUMBER },
                      y: { type: Type.NUMBER },
                      z: { type: Type.NUMBER },
                      role: { type: Type.STRING }
                    },
                    required: ['id', 'x', 'y', 'z']
                  }
                },
                edges: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      from: { type: Type.STRING },
                      to: { type: Type.STRING },
                      dashed: { type: Type.BOOLEAN },
                      category: { type: Type.STRING }
                    },
                    required: ['from', 'to', 'dashed']
                  }
                },
                faces: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      vertexIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                      color: { type: Type.STRING },
                      opacity: { type: Type.NUMBER }
                    },
                    required: ['name', 'vertexIds']
                  }
                },
                crossSection: {
                  type: Type.OBJECT,
                  properties: {
                    planeName: { type: Type.STRING },
                    polygonVertexIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                    description: { type: Type.STRING },
                    sliderParam: { type: Type.STRING },
                    minVal: { type: Type.NUMBER },
                    maxVal: { type: Type.NUMBER },
                    defaultVal: { type: Type.NUMBER }
                  }
                },
                arAnchorPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            },
            algebra2D: {
              type: Type.OBJECT,
              properties: {
                functionExpression: { type: Type.STRING },
                parameterName: { type: Type.STRING },
                minParam: { type: Type.NUMBER },
                maxParam: { type: Type.NUMBER },
                defaultParam: { type: Type.NUMBER },
                extremaDescription: { type: Type.STRING },
                tableOfVariations: { type: Type.STRING }
              }
            },
            pedagogicalScript: {
              type: Type.OBJECT,
              properties: {
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      highlightElementIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                      teacherQuestion: { type: Type.STRING }
                    },
                    required: ['stepNumber', 'title', 'description', 'teacherQuestion']
                  }
                },
                keyTeachingGoal: { type: Type.STRING }
              },
              required: ['steps', 'keyTeachingGoal']
            },
            exportData: {
              type: Type.OBJECT,
              properties: {
                latexExercise: { type: Type.STRING },
                svgCode: { type: Type.STRING },
                geogebraScript: { type: Type.STRING },
                arPreviewNotes: { type: Type.STRING }
              },
              required: ['latexExercise', 'svgCode', 'geogebraScript']
            },
            teacherNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['title', 'chapterTag', 'analysis', 'modelType', 'exportData']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Không nhận được phản hồi từ AI');
    }

    const parsed = JSON.parse(text);
    const normalized = normalizePrismGeometryServer(parsed, prompt);
    res.json(normalized);
  } catch (error: any) {
    console.error('Error in /api/solve-math:', error);
    res.status(500).json({
      error: error.message || 'Đã có lỗi xảy ra khi phân tích và vẽ hình toán học.'
    });
  }
});

function normalizePrismGeometryServer(data: any, prompt?: string): any {
  if (!data || !data.model3D || !data.model3D.vertices || data.model3D.vertices.length === 0) {
    return data;
  }

  const normalizedPrompt = (prompt || '').replace(/[’‘´`]/g, "'");
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

  let bottomIds = ['A', 'B', 'C', 'D'];
  let topIds = ["A'", "B'", "C'", "D'"];
  let isQuadPrism = true;

  if (prismMatch) {
    const bStr = prismMatch[1].toUpperCase();
    const tStr = prismMatch[2];

    if (bStr.length === 3) {
      isQuadPrism = false;
      bottomIds = bStr.split('');
      topIds = tStr.includes("'")
        ? bottomIds.map((id) => `${id}'`)
        : /\d/.test(tStr)
        ? bottomIds.map((id) => `${id}1`)
        : tStr.length === 3
        ? tStr.toUpperCase().split('')
        : bottomIds.map((id) => `${id}'`);
    } else if (bStr.length === 4) {
      isQuadPrism = true;
      bottomIds = bStr.split('');
      topIds = tStr.includes("'")
        ? bottomIds.map((id) => `${id}'`)
        : /\d/.test(tStr)
        ? bottomIds.map((id) => `${id}1`)
        : tStr.length === 4
        ? tStr.toUpperCase().split('')
        : bottomIds.map((id) => `${id}'`);
    }
  }

  const renameMap: Record<string, string> = {};
  currentVertices.forEach((v) => {
    const normId = v.id.replace(/[’‘´`]/g, "'");
    if (normId !== v.id) renameMap[v.id] = normId;
  });

  const hasPrimeInTop = topIds.some((id) => id.includes("'"));
  const hasPrimeInVertices = currentVertices.some((v) => v.id.includes("'"));

  if (hasPrimeInTop && !hasPrimeInVertices) {
    const aliasList4 = [
      ['E', 'F', 'G', 'H'],
      ['A1', 'B1', 'C1', 'D1'],
      ['A_1', 'B_1', 'C_1', 'D_1'],
    ];
    for (const cand of aliasList4) {
      if (cand.every((cId) => currentVertices.some((v) => v.id === cId))) {
        cand.forEach((cId, idx) => {
          renameMap[cId] = topIds[idx];
        });
        break;
      }
    }
  }

  if (Object.keys(renameMap).length > 0) {
    model.vertices.forEach((v: any) => {
      if (renameMap[v.id]) v.id = renameMap[v.id];
    });
    model.edges.forEach((e: any) => {
      if (renameMap[e.from]) e.from = renameMap[e.from];
      if (renameMap[e.to]) e.to = renameMap[e.to];
    });
    if (model.faces) {
      model.faces.forEach((f: any) => {
        f.vertexIds = f.vertexIds.map((id: string) => renameMap[id] || id);
      });
    }
  }

  if (isQuadPrism) {
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

    const existingIds = new Set(model.vertices.map((v: any) => v.id));
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

    model.vertices.forEach((v: any) => {
      if (canonicalMap[v.id]) {
        v.role = canonicalMap[v.id].role;
        const isCollapsed = Math.abs(v.x) < 0.01 && Math.abs(v.y) < 0.01 && Math.abs(v.z) < 0.01;
        if (isCollapsed) {
          v.x = canonicalMap[v.id].x;
          v.y = canonicalMap[v.id].y;
          v.z = canonicalMap[v.id].z;
        }
      }
    });

    const A = bottomIds[0];
    const B = bottomIds[1];
    const C = bottomIds[2];
    const D = bottomIds[3];
    const A_prime = topIds[0];
    const B_prime = topIds[1];
    const C_prime = topIds[2];
    const D_prime = topIds[3];

    const standardEdges = [
      { from: A, to: B, dashed: true, category: 'base' },
      { from: B, to: C, dashed: false, category: 'base' },
      { from: C, to: D, dashed: false, category: 'base' },
      { from: D, to: A, dashed: true, category: 'base' },
      { from: A_prime, to: B_prime, dashed: false, category: 'base' },
      { from: B_prime, to: C_prime, dashed: false, category: 'base' },
      { from: C_prime, to: D_prime, dashed: false, category: 'base' },
      { from: D_prime, to: A_prime, dashed: false, category: 'base' },
      { from: A, to: A_prime, dashed: true, category: 'lateral' },
      { from: B, to: B_prime, dashed: false, category: 'lateral' },
      { from: C, to: C_prime, dashed: false, category: 'lateral' },
      { from: D, to: D_prime, dashed: false, category: 'lateral' },
    ];

    const stdEdgeMap = new Map<string, { dashed: boolean; category: string }>();
    standardEdges.forEach((e) => {
      stdEdgeMap.set(`${e.from}__${e.to}`, { dashed: e.dashed, category: e.category });
      stdEdgeMap.set(`${e.to}__${e.from}`, { dashed: e.dashed, category: e.category });
    });

    const existingEdgeKeys = new Set<string>();
    model.edges.forEach((e: any) => {
      existingEdgeKeys.add(`${e.from}__${e.to}`);
      existingEdgeKeys.add(`${e.to}__${e.from}`);
      const std = stdEdgeMap.get(`${e.from}__${e.to}`);
      if (std) {
        e.dashed = std.dashed;
        e.category = std.category;
      }
    });

    standardEdges.forEach((stdE) => {
      if (!existingEdgeKeys.has(`${stdE.from}__${stdE.to}`)) {
        model.edges.push(stdE);
        existingEdgeKeys.add(`${stdE.from}__${stdE.to}`);
      }
    });
  }

  return data;
}

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TRỢ LÝ VẼ HÌNH _ PHẠM HẬU server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

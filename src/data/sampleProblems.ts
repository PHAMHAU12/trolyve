export interface MathProblemResponse {
  title: string;
  chapterTag: string;
  analysis: {
    entities: string[];
    geometricRelations: string[];
    problemSummary: string;
  };
  modelType: 'geometry_3d' | 'algebra_2d';
  model3D?: {
    vertices: Array<{
      id: string;
      x: number;
      y: number;
      z: number;
      role?: string;
    }>;
    edges: Array<{
      from: string;
      to: string;
      dashed: boolean;
      category?: string;
    }>;
    faces?: Array<{
      name: string;
      vertexIds: string[];
      color?: string;
      opacity?: number;
    }>;
    crossSection?: {
      planeName: string;
      polygonVertexIds: string[];
      description: string;
      sliderParam?: string;
      minVal?: number;
      maxVal?: number;
      defaultVal?: number;
    };
    arAnchorPoints?: string[];
  };
  algebra2D?: {
    functionExpression: string;
    parameterName: string;
    minParam: number;
    maxParam: number;
    defaultParam: number;
    extremaDescription: string;
    tableOfVariations: string;
  };
  pedagogicalScript: {
    steps: Array<{
      stepNumber: number;
      title: string;
      description: string;
      highlightElementIds?: string[];
      teacherQuestion: string;
    }>;
    keyTeachingGoal: string;
  };
  exportData: {
    latexExercise: string;
    svgCode: string;
    geogebraScript: string;
    arPreviewNotes?: string;
  };
  teacherNotes: string[];
}

export interface PresetProblem {
  id: string;
  title: string;
  grade: string;
  chapterTag: string;
  brief: string;
  fullPrompt: string;
  data: MathProblemResponse;
}

export const PRESET_PROBLEMS: PresetProblem[] = [
  {
    id: 'prism-abcd-parallelepiped',
    title: "Hình hộp ABCD.A'B'C'D' - Thiết diện (A'BD)",
    grade: 'Toán 11 & 12',
    chapterTag: "Lớp 11 - Chương IV: Quan hệ song song & Hình lăng trụ (SGK Kết nối tri thức)",
    brief: "Cho hình hộp ABCD.A'B'C'D'. Dựng hình hộp chuẩn SGK, tìm thiết diện (A'BD) và chứng minh (A'BD) // (B'CD').",
    fullPrompt: "Cho hình hộp ABCD.A'B'C'D'. Xác định thiết diện của hình hộp cắt bởi mặt phẳng (A'BD) và chứng minh mặt phẳng (A'BD) song song với mặt phẳng (B'CD').",
    data: {
      title: "Thiết diện (A'BD) và quan hệ song song trong hình hộp ABCD.A'B'C'D'",
      chapterTag: "Lớp 11 - Chương IV: Quan hệ song song trong không gian & Hình hộp (SGK Kết nối tri thức)",
      analysis: {
        entities: [
          "Hình hộp ABCD.A'B'C'D' với 8 đỉnh A, B, C, D, A', B', C', D' và 6 mặt là hình bình hành",
          "Mặt phẳng cắt (A'BD) đi qua ba đỉnh A', B, D",
          "Thiết diện cắt hình hộp là tam giác A'BD",
          "Mặt phẳng đối diện song song là (B'CD')"
        ],
        geometricRelations: [
          "Tứ giác ABB'A' và CDD'C' là các hình bình hành bằng nhau và song song => A'B // D'C",
          "Tứ giác BDD'B' là hình bình hành => BD // B'D'",
          "Mặt phẳng (A'BD) chứa hai đường thẳng cắt nhau A'B và BD lần lượt song song với hai đường thẳng cắt nhau D'C và B'D' của (B'CD') => (A'BD) // (B'CD')",
          "Quy tắc biểu diễn SGK: Đỉnh A nằm ở góc trong che khuất nên 3 cạnh AA', AB, AD vẽ bằng nét đứt; 9 cạnh còn lại vẽ bằng nét liền"
        ],
        problemSummary: "Bài toán nền tảng SGK Hình học 11 về tính chất hình hộp ABCD.A'B'C'D', thiết diện tam giác và phương pháp chứng minh hai mặt phẳng song song."
      },
      modelType: 'geometry_3d',
      model3D: {
        vertices: [
          { id: 'A', x: -2.0, y: 0.0, z: -1.2, role: 'base' },
          { id: 'B', x: -1.0, y: 0.0, z: 1.2, role: 'base' },
          { id: 'C', x: 2.5, y: 0.0, z: 1.2, role: 'base' },
          { id: 'D', x: 1.5, y: 0.0, z: -1.2, role: 'base' },
          { id: "A'", x: -2.0, y: 3.2, z: -1.2, role: 'top_base' },
          { id: "B'", x: -1.0, y: 3.2, z: 1.2, role: 'top_base' },
          { id: "C'", x: 2.5, y: 3.2, z: 1.2, role: 'top_base' },
          { id: "D'", x: 1.5, y: 3.2, z: -1.2, role: 'top_base' }
        ],
        edges: [
          // Đáy dưới (A ở góc khuất: AB, AD nét đứt; BC, CD nét liền)
          { from: 'A', to: 'B', dashed: true, category: 'base' },
          { from: 'B', to: 'C', dashed: false, category: 'base' },
          { from: 'C', to: 'D', dashed: false, category: 'base' },
          { from: 'D', to: 'A', dashed: true, category: 'base' },
          // Đáy trên (cả 4 cạnh nhìn thấy: nét liền)
          { from: "A'", to: "B'", dashed: false, category: 'base' },
          { from: "B'", to: "C'", dashed: false, category: 'base' },
          { from: "C'", to: "D'", dashed: false, category: 'base' },
          { from: "D'", to: "A'", dashed: false, category: 'base' },
          // Cạnh bên (AA' nét đứt; BB', CC', DD' nét liền)
          { from: 'A', to: "A'", dashed: true, category: 'lateral' },
          { from: 'B', to: "B'", dashed: false, category: 'lateral' },
          { from: 'C', to: "C'", dashed: false, category: 'lateral' },
          { from: 'D', to: "D'", dashed: false, category: 'lateral' },
          // Thiết diện (A'BD): A'B nét liền, BD nét liền, DA' nét đứt
          { from: "A'", to: 'B', dashed: false, category: 'cross_section' },
          { from: 'B', to: 'D', dashed: false, category: 'cross_section' },
          { from: 'D', to: "A'", dashed: true, category: 'cross_section' }
        ],
        faces: [
          { name: 'Đáy dưới ABCD', vertexIds: ['A', 'B', 'C', 'D'], color: '#94a3b8', opacity: 0.12 },
          { name: "Đáy trên A'B'C'D'", vertexIds: ["A'", "B'", "C'", "D'"], color: '#38bdf8', opacity: 0.15 },
          { name: "Mặt bên ABB'A'", vertexIds: ['A', 'B', "B'", "A'"], color: '#64748b', opacity: 0.08 },
          { name: "Mặt bên BCC'B'", vertexIds: ['B', 'C', "C'", "B'"], color: '#0ea5e9', opacity: 0.12 },
          { name: "Mặt bên CDD'C'", vertexIds: ['C', 'D', "D'", "C'"], color: '#0ea5e9', opacity: 0.12 },
          { name: "Mặt bên DAA'D'", vertexIds: ['D', 'A', "A'", "D'"], color: '#64748b', opacity: 0.08 },
          { name: "Thiết diện tam giác A'BD", vertexIds: ["A'", 'B', 'D'], color: '#f59e0b', opacity: 0.55 }
        ],
        crossSection: {
          planeName: "Mặt phẳng thiết diện (A'BD)",
          polygonVertexIds: ["A'", 'B', 'D'],
          description: "Tam giác A'BD là thiết diện cắt bởi mặt phẳng (A'BD). Mặt phẳng này song song với mặt phẳng (B'CD').",
          sliderParam: 'Vị trí mặt phẳng thiết diện song song',
          minVal: 0.1,
          maxVal: 0.9,
          defaultVal: 0.5
        },
        arAnchorPoints: [
          'Gốc tọa độ đáy O(0.25, 0, 0)',
          'Đỉnh A(-2.0, 0, -1.2)',
          'Đỉnh C(2.5, 0, 1.2)',
          "Đỉnh A'(-2.0, 3.2, -1.2)",
          "Đỉnh C'(2.5, 3.2, 1.2)"
        ]
      },
      pedagogicalScript: {
        steps: [
          {
            stepNumber: 1,
            title: "Dựng hai đáy hình bình hành ABCD và A'B'C'D'",
            description: "Dựng đáy dưới ABCD trên mặt phẳng y = 0 với các cạnh AB, AD nét đứt (khuất), BC, CD nét liền. Dựng đáy trên A'B'C'D' tịnh tiến thẳng đứng với toàn bộ 4 cạnh nét liền.",
            highlightElementIds: ['A', 'B', 'C', 'D', "A'", "B'", "C'", "D'"],
            teacherQuestion: "Tại sao trong hình biểu diễn của hình hộp, 3 cạnh đồng quy tại đỉnh A lại được vẽ bằng nét đứt?"
          },
          {
            stepNumber: 2,
            title: "Nối 4 cạnh bên AA', BB', CC', DD'",
            description: "Nối AA' bằng nét đứt (cạnh khuất), ba cạnh bên BB', CC', DD' vẽ bằng nét liền.",
            highlightElementIds: ["A-A'", "B-B'", "C-C'", "D-D'"],
            teacherQuestion: "Các cạnh bên của hình hộp có mối quan hệ hình học gì với nhau?"
          },
          {
            stepNumber: 3,
            title: "Dựng thiết diện tam giác A'BD",
            description: "Nối A' với B (nét liền), B với D (nét liền), và D với A' (nét đứt vì nằm bên trong khối hộp). Ta được thiết diện là tam giác A'BD.",
            highlightElementIds: ["A'-B", 'B-D', "D-A'"],
            teacherQuestion: "Thiết diện tạo bởi mặt phẳng (A'BD) và hình hộp ABCD.A'B'C'D' là hình gì?"
          },
          {
            stepNumber: 4,
            title: "Chứng minh (A'BD) // (B'CD')",
            description: "Chỉ ra A'B // D'C và BD // B'D'. Hai đường thẳng cắt nhau trong (A'BD) lần lượt song song với hai đường thẳng cắt nhau trong (B'CD'), suy ra (A'BD) // (B'CD').",
            highlightElementIds: ["A'-B", 'B-D'],
            teacherQuestion: "Hãy nêu định lý điều kiện để hai mặt phẳng song song trong không gian?"
          }
        ],
        keyTeachingGoal: "Nắm vững kỹ năng vẽ hình hộp ABCD.A'B'C'D' chuẩn SGK, xác định đúng nét đứt/nét liền và vận dụng định lý chứng minh hai mặt phẳng song song."
      },
      exportData: {
        latexExercise: `\\begin{exercise}
Cho hình hộp $ABCD.A'B'C'D'$.
\\begin{enumerate}[a)]
  \\item Xác định thiết diện của hình hộp cắt bởi mặt phẳng $(A'BD)$.
  \\item Chứng minh rằng mặt phẳng $(A'BD)$ song song với mặt phẳng $(B'CD')$.
\\end{enumerate}
\\end{exercise}
\\begin{solution}
a) Ba điểm $A', B, D$ cùng thuộc hình hộp.
Đoạn $A'B$ nằm trên mặt bên $(ABB'A')$.
Đoạn $BD$ nằm trên mặt đáy $(ABCD)$.
Đoạn $A'D$ nằm trên mặt bên $(ADD'A')$.
Do đó, thiết diện của hình hộp cắt bởi mặt phẳng $(A'BD)$ chính là tam giác $A'BD$.
\\\\
b) Xét hai mặt phẳng $(A'BD)$ và $(B'CD')$:
- Tứ giác $ABB'A'$ là hình bình hành nên $A'B \\parallel AB'$. Tứ giác $CDD'C'$ là hình bình hành bằng $ABB'A'$ nên $AB' \\parallel D'C$. Do đó $A'B \\parallel D'C$.
Mà $D'C \\subset (B'CD')$ nên $A'B \\parallel (B'CD')$.
- Tứ giác $BDD'B'$ là hình bình hành nên $BD \\parallel B'D'$.
Mà $B'D' \\subset (B'CD')$ nên $BD \\parallel (B'CD')$.
- Mặt khác, $A'B$ và $BD$ là hai đường thẳng cắt nhau tại $B$ và cùng nằm trong $(A'BD)$.
Từ đó suy ra $(A'BD) \\parallel (B'CD')$.
\\end{solution}`,
        svgCode: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <rect width="500" height="400" fill="#f8fafc" rx="12" />
  
  <!-- Dashed hidden edges of prism from vertex A -->
  <line x1="120" y1="260" x2="220" y2="330" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" />
  <line x1="120" y1="260" x2="330" y2="260" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" />
  <line x1="120" y1="260" x2="120" y2="100" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" />
  
  <!-- Dashed cross-section edge DA' -->
  <line x1="330" y1="260" x2="120" y2="100" stroke="#d97706" stroke-width="2" stroke-dasharray="5,5" />
  
  <!-- Shaded Cross Section Triangle A'BD -->
  <polygon points="120,100 220,330 330,260" fill="#f59e0b" fill-opacity="0.35" stroke="#d97706" stroke-width="2" />

  <!-- Solid edges of bottom base -->
  <line x1="220" y1="330" x2="430" y2="330" stroke="#1e293b" stroke-width="2.2" />
  <line x1="430" y1="330" x2="330" y2="260" stroke="#1e293b" stroke-width="2.2" />
  
  <!-- Solid edges of top base A'B'C'D' -->
  <line x1="120" y1="100" x2="220" y2="170" stroke="#1e293b" stroke-width="2.2" />
  <line x1="220" y1="170" x2="430" y2="170" stroke="#1e293b" stroke-width="2.2" />
  <line x1="430" y1="170" x2="330" y2="100" stroke="#1e293b" stroke-width="2.2" />
  <line x1="330" y1="100" x2="120" y2="100" stroke="#1e293b" stroke-width="2.2" />
  
  <!-- Solid lateral edges BB', CC', DD' -->
  <line x1="220" y1="330" x2="220" y2="170" stroke="#1e293b" stroke-width="2.2" />
  <line x1="430" y1="330" x2="430" y2="170" stroke="#1e293b" stroke-width="2.2" />
  <line x1="330" y1="260" x2="330" y2="100" stroke="#1e293b" stroke-width="2.2" />
  
  <!-- Solid cross section edge BD -->
  <line x1="220" y1="330" x2="330" y2="260" stroke="#d97706" stroke-width="2.2" />

  <!-- Vertices Bottom -->
  <circle cx="120" cy="260" r="4" fill="#64748b" />
  <circle cx="220" cy="330" r="4.5" fill="#0284c7" />
  <circle cx="430" cy="330" r="4.5" fill="#0284c7" />
  <circle cx="330" cy="260" r="4.5" fill="#0284c7" />
  
  <!-- Vertices Top -->
  <circle cx="120" cy="100" r="4.5" fill="#7c3aed" />
  <circle cx="220" cy="170" r="4.5" fill="#7c3aed" />
  <circle cx="430" cy="170" r="4.5" fill="#7c3aed" />
  <circle cx="330" cy="100" r="4.5" fill="#7c3aed" />

  <!-- Labels Bottom -->
  <text x="96" y="265" font-weight="bold" font-size="15" fill="#64748b">A</text>
  <text x="210" y="355" font-weight="bold" font-size="15" fill="#0f172a">B</text>
  <text x="445" y="340" font-weight="bold" font-size="15" fill="#0f172a">C</text>
  <text x="345" y="265" font-weight="bold" font-size="15" fill="#0f172a">D</text>

  <!-- Labels Top -->
  <text x="96" y="95" font-weight="bold" font-size="15" fill="#6d28d9">A'</text>
  <text x="200" y="165" font-weight="bold" font-size="15" fill="#6d28d9">B'</text>
  <text x="445" y="170" font-weight="bold" font-size="15" fill="#6d28d9">C'</text>
  <text x="345" y="95" font-weight="bold" font-size="15" fill="#6d28d9">D'</text>
</svg>`,
        geogebraScript: `// GeoGebra 3D Script Hình hộp ABCD.A'B'C'D'
A = Point({-2, -1.2, 0})
B = Point({-1, 1.2, 0})
C = Point({2.5, 1.2, 0})
D = Point({1.5, -1.2, 0})
Polygon(A, B, C, D)
v = Vector({0, 0, 3.2})
Prism(Polygon1, v)
Plane(A', B, D)`
      },
      teacherNotes: [
        "Học sinh hay nhầm vẽ nét liền cho cạnh AA' hoặc AB, AD. Cần khắc sâu: Đỉnh A thụt vào trong thì cả 3 cạnh xuất phát từ A đều là nét đứt.",
        "Thiết diện (A'BD) và mặt phẳng (B'CD') chia khối hộp thành 3 phần: hai khối chóp tam giác bằng nhau ở hai góc đối xứng và một khối đa diện ở giữa.",
        "Mở rộng: Tính thể tích khối tứ diện A'.ABD so với thể tích khối hộp ABCD.A'B'C'D' (kết quả bằng 1/6)."
      ]
    }
  },
  {
    id: 'pyramid-parallel-mbc',
    title: 'Hình chóp S.ABCD - Thiết diện song song (MBC)',
    grade: 'Toán 11',
    chapterTag: 'Lớp 11 - Chương IV: Quan hệ song song trong không gian (SGK Kết nối tri thức)',
    brief: 'Cho hình chóp S.ABCD đáy bình hành. M là trung điểm SA. Tìm thiết diện cắt bởi (MBC).',
    fullPrompt: 'Cho hình chóp S.ABCD có đáy ABCD là hình bình hành. Gọi M là trung điểm của cạnh SA. Xác định thiết diện của hình chóp S.ABCD cắt bởi mặt phẳng (MBC).',
    data: {
      title: 'Thiết diện của hình chóp S.ABCD cắt bởi mặt phẳng (MBC)',
      chapterTag: 'Lớp 11 - Chương IV: Quan hệ song song trong không gian (SGK Kết nối tri thức)',
      analysis: {
        entities: [
          'Hình chóp S.ABCD với đỉnh S, đáy ABCD là hình bình hành',
          'Điểm M là trung điểm của đoạn thẳng SA',
          'Mặt phẳng (MBC) chứa đường thẳng BC',
          'Đoạn giao tuyến MN // AD // BC với N là trung điểm của SD',
          'Thiết diện là hình thang BCNM'
        ],
        geometricRelations: [
          'BC // AD (tính chất hình bình hành ABCD)',
          '(MBC) chứa BC // AD nên giao tuyến của (MBC) với (SAD) đi qua M và song song với AD',
          'MN // AD => N là trung điểm của SD',
          'MN // BC => Tứ giác BCNM là hình thang'
        ],
        problemSummary: 'Bài toán kinh điển ứng dụng định lý giao tuyến của ba mặt phẳng và định lý song song giữa đường thẳng và mặt phẳng.'
      },
      modelType: 'geometry_3d',
      model3D: {
        vertices: [
          { id: 'A', x: -2, y: 0, z: -1.5, role: 'base' },
          { id: 'B', x: -1, y: 0, z: 1.5, role: 'base' },
          { id: 'C', x: 2.5, y: 0, z: 1.5, role: 'base' },
          { id: 'D', x: 1.5, y: 0, z: -1.5, role: 'base' },
          { id: 'S', x: 0, y: 3.5, z: 0, role: 'apex' },
          { id: 'M', x: -1, y: 1.75, z: -0.75, role: 'midpoint' },
          { id: 'N', x: 0.75, y: 1.75, z: -0.75, role: 'midpoint' }
        ],
        edges: [
          // Đáy
          { from: 'A', to: 'B', dashed: false, category: 'base' },
          { from: 'B', to: 'C', dashed: false, category: 'base' },
          { from: 'C', to: 'D', dashed: false, category: 'base' },
          { from: 'D', to: 'A', dashed: true, category: 'base' },
          // Cạnh bên
          { from: 'S', to: 'A', dashed: true, category: 'lateral' },
          { from: 'S', to: 'B', dashed: false, category: 'lateral' },
          { from: 'S', to: 'C', dashed: false, category: 'lateral' },
          { from: 'S', to: 'D', dashed: false, category: 'lateral' },
          // Thiết diện (MBC) -> B-C-N-M
          { from: 'M', to: 'B', dashed: false, category: 'cross_section' },
          { from: 'B', to: 'C', dashed: false, category: 'cross_section' },
          { from: 'C', to: 'N', dashed: false, category: 'cross_section' },
          { from: 'N', to: 'M', dashed: true, category: 'cross_section' }
        ],
        faces: [
          { name: 'Đáy ABCD', vertexIds: ['A', 'B', 'C', 'D'], color: '#94a3b8', opacity: 0.15 },
          { name: 'Mặt bên SAB', vertexIds: ['S', 'A', 'B'], color: '#38bdf8', opacity: 0.1 },
          { name: 'Mặt bên SBC', vertexIds: ['S', 'B', 'C'], color: '#38bdf8', opacity: 0.12 },
          { name: 'Mặt bên SCD', vertexIds: ['S', 'C', 'D'], color: '#38bdf8', opacity: 0.1 },
          { name: 'Mặt bên SAD', vertexIds: ['S', 'A', 'D'], color: '#38bdf8', opacity: 0.08 },
          { name: 'Thiết diện BCNM', vertexIds: ['B', 'C', 'N', 'M'], color: '#f59e0b', opacity: 0.55 }
        ],
        crossSection: {
          planeName: 'Mặt phẳng thiết diện (MBC)',
          polygonVertexIds: ['B', 'C', 'N', 'M'],
          description: 'Hình thang BCNM với MN // BC và MN = 1/2 AD = 1/2 BC',
          sliderParam: 'k (tỷ số vị trí M trên SA)',
          minVal: 0.1,
          maxVal: 0.9,
          defaultVal: 0.5
        },
        arAnchorPoints: ['Gốc tâm đáy O(0.25, 0, 0)', 'Đỉnh S(0, 3.5, 0)', 'Điểm A(-2, 0, -1.5)', 'Điểm C(2.5, 0, 1.5)']
      },
      pedagogicalScript: {
        steps: [
          {
            stepNumber: 1,
            title: 'Dựng đáy hình bình hành ABCD',
            description: 'Vẽ hình bình hành ABCD trên mặt phẳng nằm ngang. Cạnh AD nằm phía trong nên quy ước vẽ bằng nét đứt (khuất).',
            highlightElementIds: ['A', 'B', 'C', 'D'],
            teacherQuestion: 'Tại sao cạnh AD lại được vẽ bằng nét đứt trong hình biểu diễn không gian?'
          },
          {
            stepNumber: 2,
            title: 'Xác định đỉnh S và nối các cạnh bên',
            description: 'Chọn đỉnh S phía trên mặt phẳng đáy. Nối SA (khuất - nét đứt), SB, SC, SD (nhìn thấy - nét liền).',
            highlightElementIds: ['S', 'S-A', 'S-B', 'S-C', 'S-D'],
            teacherQuestion: 'Đỉnh S nằm ở đâu thì hình biểu diễn trông cân đối và dễ quan sát nhất?'
          },
          {
            stepNumber: 3,
            title: 'Xác định điểm M và tìm giao tuyến với (SAD)',
            description: 'Lấy M là trung điểm SA. Mặt phẳng (MBC) chứa BC // AD (thuộc mặt phẳng SAD). Theo định lý giao tuyến, giao tuyến qua M và song song với AD, cắt SD tại N.',
            highlightElementIds: ['M', 'N', 'M-N', 'B-C'],
            teacherQuestion: 'Các em hãy nêu định lý về giao tuyến của hai mặt phẳng lần lượt chứa hai đường thẳng song song?'
          },
          {
            stepNumber: 4,
            title: 'Hoàn thiện thiết diện BCNM',
            description: 'Nối MB, BC, CN, NM. Ta được thiết diện là tứ giác BCNM có MN // BC, do đó thiết diện là một hình thang.',
            highlightElementIds: ['M-B', 'B-C', 'C-N', 'N-M'],
            teacherQuestion: 'Tứ giác BCNM là hình gì? Tỷ số diện tích của tam giác SMN và tam giác SAD bằng bao nhiêu?'
          }
        ],
        keyTeachingGoal: 'Giúp học sinh nắm vững phương pháp tìm giao tuyến bằng quan hệ song song và kỹ năng dựng thiết diện trong hình học không gian 11.'
      },
      exportData: {
        latexExercise: `\\begin{exercise}
Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình bình hành. Gọi $M$ là trung điểm của cạnh $SA$.
\\begin{enumerate}[a)]
  \\item Xác định giao tuyến của mặt phẳng $(MBC)$ với mặt phẳng $(SAD)$.
  \\item Tìm thiết diện của hình chóp $S.ABCD$ cắt bởi mặt phẳng $(MBC)$ và chứng minh thiết diện là một hình thang.
\\end{enumerate}
\\end{exercise}
\\begin{solution}
Ta có: $BC \\subset (MBC)$, $AD \\subset (SAD)$ mà $BC \\parallel AD$ (do $ABCD$ là hình bình hành).
Điểm $M \\in SA \\subset (SAD)$ và $M \\in (MBC) \\Rightarrow M$ là điểm chung của $(MBC)$ và $(SAD)$.
Do đó, giao tuyến của $(MBC)$ và $(SAD)$ là đường thẳng $d$ đi qua $M$ và song song với $AD$ (và $BC$).
Trong $(SAD)$, đường thẳng $d$ cắt $SD$ tại $N$. Do $M$ là trung điểm $SA$ nên $N$ là trung điểm $SD$.
Vậy thiết diện là tứ giác $BCNM$ có $MN \\parallel BC$, nên $BCNM$ là hình thang.
\\end{solution}`,
        svgCode: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <defs>
    <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#d97706" stop-opacity="0.75" />
    </linearGradient>
  </defs>
  <!-- Background Grid -->
  <rect width="500" height="400" fill="#f8fafc" rx="12" />
  
  <!-- Dashed hidden lines -->
  <line x1="120" y1="280" x2="380" y2="280" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="5,5" />
  <line x1="250" y1="60" x2="120" y2="280" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="5,5" />
  <line x1="185" y1="170" x2="315" y2="170" stroke="#d97706" stroke-width="2.5" stroke-dasharray="5,5" />

  <!-- Shaded Cross Section BCNM -->
  <polygon points="80,340 440,340 315,170 185,170" fill="url(#planeGrad)" stroke="#b45309" stroke-width="2" />

  <!-- Solid edges -->
  <line x1="80" y1="340" x2="440" y2="340" stroke="#1e293b" stroke-width="2.2" />
  <line x1="120" y1="280" x2="80" y2="340" stroke="#1e293b" stroke-width="2" />
  <line x1="380" y1="280" x2="440" y2="340" stroke="#1e293b" stroke-width="2" />
  <line x1="250" y1="60" x2="80" y2="340" stroke="#1e293b" stroke-width="2.2" />
  <line x1="250" y1="60" x2="440" y2="340" stroke="#1e293b" stroke-width="2.2" />
  <line x1="250" y1="60" x2="380" y2="280" stroke="#1e293b" stroke-width="2" />
  <line x1="185" y1="170" x2="80" y2="340" stroke="#d97706" stroke-width="2.2" />
  <line x1="315" y1="170" x2="440" y2="340" stroke="#d97706" stroke-width="2.2" />

  <!-- Vertices -->
  <circle cx="250" cy="60" r="4.5" fill="#0284c7" />
  <circle cx="120" cy="280" r="4" fill="#64748b" />
  <circle cx="80" cy="340" r="4" fill="#0284c7" />
  <circle cx="440" cy="340" r="4" fill="#0284c7" />
  <circle cx="380" cy="280" r="4" fill="#64748b" />
  <circle cx="185" cy="170" r="4.5" fill="#d97706" />
  <circle cx="315" cy="170" r="4.5" fill="#d97706" />

  <!-- Labels -->
  <text x="250" y="45" font-weight="bold" font-size="16" fill="#0f172a" text-anchor="middle">S</text>
  <text x="100" y="280" font-weight="bold" font-size="15" fill="#475569">A</text>
  <text x="60" y="355" font-weight="bold" font-size="15" fill="#0f172a">B</text>
  <text x="455" y="355" font-weight="bold" font-size="15" fill="#0f172a">C</text>
  <text x="395" y="280" font-weight="bold" font-size="15" fill="#475569">D</text>
  <text x="160" y="165" font-weight="bold" font-size="15" fill="#b45309">M</text>
  <text x="330" y="165" font-weight="bold" font-size="15" fill="#b45309">N</text>
</svg>`,
        geogebraScript: `// GeoGebra 3D Script
A = Point({-2, -1.5, 0})
B = Point({-1, 1.5, 0})
C = Point({2.5, 1.5, 0})
D = Point({1.5, -1.5, 0})
Polygon(A, B, C, D)
S = Point({0, 0, 3.5})
Pyramid(Polygon1, S)
M = Midpoint(S, A)
p = Plane(M, Line(B, C))
IntersectRegion(Pyramid1, p)`,
        arPreviewNotes: 'Đặt mô hình trên mặt bàn. Cố định tâm đáy O(0,0,0) làm World Origin.'
      },
      teacherNotes: [
        'Học sinh thường quên vẽ nét đứt cho cạnh AD và SA dẫn đến sai quy tắc biểu diễn không gian.',
        'Cần nhấn mạnh: Không nối trực tiếp M với C khi chưa tìm được giao tuyến với mặt (SAD) vì MC cắt bên trong khối chóp.',
        'Mở rộng: Nếu M di động trên SA với tỉ số k = SM/SA, diện tích thiết diện biến thiên như thế nào?'
      ]
    }
  },
  {
    id: 'perpendicular-pyramid',
    title: 'Hình chóp S.ABC có SA ⊥ (ABC) - Góc giữa hai mặt phẳng',
    grade: 'Toán 11',
    chapterTag: 'Lớp 11 - Chương IV: Quan hệ vuông góc trong không gian (SGK Kết nối tri thức)',
    brief: 'Cho hình chóp S.ABC có SA ⊥ đáy, tam giác ABC vuông tại B. Xác định góc giữa (SBC) và (ABC).',
    fullPrompt: 'Cho hình chóp S.ABC có đáy ABC là tam giác vuông tại B, cạnh bên SA vuông góc với mặt phẳng đáy (ABC). Hãy dựng hình 3D, xác định góc giữa mặt phẳng (SBC) và mặt phẳng (ABC), và lập kịch bản giảng dạy.',
    data: {
      title: 'Góc giữa hai mặt phẳng (SBC) và (ABC) trong hình chóp S.ABC có SA ⊥ (ABC)',
      chapterTag: 'Lớp 11 - Chương IV: Quan hệ vuông góc trong không gian (SGK Kết nối tri thức)',
      analysis: {
        entities: [
          'Đáy ABC là tam giác vuông tại B',
          'Đường cao SA vuông góc với mặt đáy (ABC)',
          'Mặt phẳng (SBC) chứa cạnh bên SB và cạnh đáy BC',
          'Giao tuyến giữa (SBC) và (ABC) là đường thẳng BC'
        ],
        geometricRelations: [
          'SA ⊥ (ABC) => SA ⊥ BC',
          'AB ⊥ BC (do tam giác ABC vuông tại B)',
          'BC ⊥ (SAB) => BC ⊥ SB',
          'SB ⊥ BC tại B và AB ⊥ BC tại B => Góc giữa (SBC) và (ABC) là góc SBA'
        ],
        problemSummary: 'Bài toán nền tảng định lý ba đường vuông góc và phương pháp xác định góc giữa hai mặt phẳng thông qua đường vuông góc chung với giao tuyến.'
      },
      modelType: 'geometry_3d',
      model3D: {
        vertices: [
          { id: 'A', x: -1.8, y: 0, z: -1.2, role: 'base' },
          { id: 'B', x: 0.5, y: 0, z: 1.5, role: 'base' },
          { id: 'C', x: 2.8, y: 0, z: -0.5, role: 'base' },
          { id: 'S', x: -1.8, y: 3.6, z: -1.2, role: 'apex' }
        ],
        edges: [
          { from: 'A', to: 'B', dashed: false, category: 'base' },
          { from: 'B', to: 'C', dashed: false, category: 'base' },
          { from: 'C', to: 'A', dashed: true, category: 'base' },
          { from: 'S', to: 'A', dashed: true, category: 'height' },
          { from: 'S', to: 'B', dashed: false, category: 'lateral' },
          { from: 'S', to: 'C', dashed: false, category: 'lateral' }
        ],
        faces: [
          { name: 'Đáy ABC', vertexIds: ['A', 'B', 'C'], color: '#94a3b8', opacity: 0.15 },
          { name: 'Mặt bên SAB', vertexIds: ['S', 'A', 'B'], color: '#10b981', opacity: 0.3 },
          { name: 'Mặt bên SBC', vertexIds: ['S', 'B', 'C'], color: '#6366f1', opacity: 0.2 },
          { name: 'Mặt bên SAC', vertexIds: ['S', 'A', 'C'], color: '#64748b', opacity: 0.1 }
        ],
        crossSection: {
          planeName: 'Mặt phẳng xác định góc (SAB)',
          polygonVertexIds: ['S', 'A', 'B'],
          description: 'Mặt phẳng (SAB) vuông góc với giao tuyến BC tại điểm B. Góc phẳng nhị diện là góc SBA.',
          sliderParam: 'Chiều cao h (SA)',
          minVal: 1.0,
          maxVal: 5.0,
          defaultVal: 3.6
        },
        arAnchorPoints: ['Chân đường cao A(-1.8, 0, -1.2)', 'Đỉnh S(-1.8, 3.6, -1.2)', 'Đỉnh góc vuông B(0.5, 0, 1.5)']
      },
      pedagogicalScript: {
        steps: [
          {
            stepNumber: 1,
            title: 'Dựng tam giác đáy ABC vuông tại B',
            description: 'Vẽ tam giác ABC với góc B vuông. Đặt cạnh AC ở phía trong (vẽ nét đứt), AB và BC nét liền.',
            highlightElementIds: ['A', 'B', 'C', 'A-B', 'B-C', 'C-A'],
            teacherQuestion: 'Tại sao góc vuông trong hình học không gian thường không vẽ thành góc 90 độ?'
          },
          {
            stepNumber: 2,
            title: 'Dựng đường cao SA thẳng đứng từ điểm A',
            description: 'Từ điểm A dựng đoạn thẳng SA thẳng đứng vuông góc với mặt phẳng hình biểu diễn (vẽ nét đứt vì nằm khuất sau các mặt).',
            highlightElementIds: ['S', 'S-A'],
            teacherQuestion: 'Nếu SA vuông góc với (ABC), thì SA vuông góc với những đường thẳng nào trong mặt phẳng đáy?'
          },
          {
            stepNumber: 3,
            title: 'Nối các cạnh bên SB và SC',
            description: 'Nối S với B và C bằng nét liền vì hai đoạn thẳng này nằm ở phía trước mắt người quan sát.',
            highlightElementIds: ['S-B', 'S-C'],
            teacherQuestion: 'Tam giác SBC là tam giác gì? Hãy chứng minh SBC vuông tại B!'
          },
          {
            stepNumber: 4,
            title: 'Xác định góc giữa hai mặt phẳng (SBC) và (ABC)',
            description: 'Giao tuyến là BC. Trong (ABC) có AB ⊥ BC. Trong (SBC) có SB ⊥ BC. Do đó góc phẳng nhị diện chính là góc SBA.',
            highlightElementIds: ['S-B', 'A-B'],
            teacherQuestion: 'Nếu cho AB = a và SA = a√3, em hãy tính số đo của góc giữa (SBC) và (ABC)?'
          }
        ],
        keyTeachingGoal: 'Nắm vững quy tắc tìm góc giữa hai mặt phẳng: Xác định giao tuyến, tìm hai đường thẳng trong hai mặt phẳng cùng vuông góc với giao tuyến tại một điểm.'
      },
      exportData: {
        latexExercise: `\\begin{exercise}
Cho hình chóp $S.ABC$ có đáy $ABC$ là tam giác vuông tại $B$, $AB = a, BC = a\\sqrt{3}$. Cạnh bên $SA$ vuông góc với mặt phẳng đáy và $SA = a$.
\\begin{enumerate}[a)]
  \\item Chứng minh tam giác $SBC$ vuông tại $B$.
  \\item Xác định và tính số đo của góc giữa mặt phẳng $(SBC)$ và mặt phẳng $(ABC)$.
\\end{enumerate}
\\end{exercise}
\\begin{solution}
a) Ta có: $SA \\perp (ABC) \\Rightarrow SA \\perp BC$.
Mà $AB \\perp BC$ (tam giác $ABC$ vuông tại $B$).
Suy ra $BC \\perp (SAB) \\Rightarrow BC \\perp SB$. Do đó $\\triangle SBC$ vuông tại $B$.
\\\\
b) Ta có $(SBC) \\cap (ABC) = BC$.
Trong $(ABC): AB \\perp BC$ tại $B$.
Trong $(SBC): SB \\perp BC$ tại $B$.
Suy ra góc giữa hai mặt phẳng $(SBC)$ và $(ABC)$ là $\\widehat{SBA}$.
Xét tam giác vuông $SAB$: $\\tan \\widehat{SBA} = \\frac{SA}{AB} = \\frac{a}{a} = 1 \\Rightarrow \\widehat{SBA} = 45^\\circ$.
\\end{solution}`,
        svgCode: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <rect width="500" height="400" fill="#f8fafc" rx="12" />
  <!-- Hidden lines -->
  <line x1="120" y1="260" x2="420" y2="260" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="5,5" />
  <line x1="120" y1="70" x2="120" y2="260" stroke="#059669" stroke-width="2.5" stroke-dasharray="5,5" />
  
  <!-- Colored face SAB -->
  <polygon points="120,70 120,260 260,350" fill="#10b981" fill-opacity="0.18" />

  <!-- Solid edges -->
  <line x1="120" y1="260" x2="260" y2="350" stroke="#1e293b" stroke-width="2.2" />
  <line x1="260" y1="350" x2="420" y2="260" stroke="#1e293b" stroke-width="2.2" />
  <line x1="120" y1="70" x2="260" y2="350" stroke="#4f46e5" stroke-width="2.5" />
  <line x1="120" y1="70" x2="420" y2="260" stroke="#1e293b" stroke-width="2" />

  <!-- Right angle symbols -->
  <!-- at B: AB perp BC -->
  <path d="M 245,340 L 255,334 L 270,344" fill="none" stroke="#dc2626" stroke-width="1.8" />
  <!-- at A: SA perp AB -->
  <path d="M 120,240 L 135,240 L 135,260" fill="none" stroke="#059669" stroke-width="1.8" />

  <!-- Angle arc for SBA -->
  <path d="M 235,330 A 25 25 0 0 1 245,310" fill="none" stroke="#d97706" stroke-width="2.5" />
  <text x="210" y="315" font-size="13" font-weight="bold" fill="#d97706">φ</text>

  <!-- Vertices -->
  <circle cx="120" cy="70" r="4.5" fill="#0284c7" />
  <circle cx="120" cy="260" r="4" fill="#64748b" />
  <circle cx="260" cy="350" r="4.5" fill="#0284c7" />
  <circle cx="420" cy="260" r="4" fill="#0284c7" />

  <!-- Labels -->
  <text x="120" y="50" font-weight="bold" font-size="16" fill="#0f172a" text-anchor="middle">S</text>
  <text x="95" y="265" font-weight="bold" font-size="15" fill="#64748b">A</text>
  <text x="260" y="375" font-weight="bold" font-size="15" fill="#0f172a" text-anchor="middle">B</text>
  <text x="435" y="265" font-weight="bold" font-size="15" fill="#0f172a">C</text>
</svg>`,
        geogebraScript: `// GeoGebra 3D Script
A = Point({0, 0, 0})
B = Point({0, 2, 0})
C = Point({3, 2, 0})
Polygon(A, B, C)
S = Point({0, 0, 2})
Pyramid(Polygon1, S)
Angle(S, B, A)`
      },
      teacherNotes: [
        'Học sinh hay nhầm tưởng góc giữa (SBC) và (ABC) là góc SCA.',
        'Mẹo nhớ định lý 3 đường vuông góc: Đáy vuông tại đâu (B), chân đường cao chiếu từ đâu (A) thì góc nằm tại đỉnh đó (SBA).',
        'Có thể mở rộng tính khoảng cách từ A đến mặt phẳng (SBC).'
      ]
    }
  },
  {
    id: 'calculus-cubic-parameter',
    title: 'Khảo sát hàm số bậc ba chứa tham số m',
    grade: 'Toán 12',
    chapterTag: 'Lớp 12 - Chương I: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số (SGK Kết nối tri thức)',
    brief: 'Khảo sát hàm số y = x³ - 3mx² + 3(m² - 1)x + 1 và sự biến thiên của 2 điểm cực trị theo m.',
    fullPrompt: 'Cho hàm số y = x^3 - 3mx^2 + 3(m^2 - 1)x + 1. Khảo sát sự tồn tại và khoảng cách giữa hai điểm cực trị theo tham số m. Thiết lập mô hình đồ thị tương tác có thanh trượt tham số m.',
    data: {
      title: 'Khảo sát sự biến thiên và cực trị hàm số bậc ba theo tham số m',
      chapterTag: 'Lớp 12 - Chương I: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số (SGK Kết nối tri thức)',
      analysis: {
        entities: [
          'Hàm số bậc ba: y = x^3 - 3mx^2 + 3(m^2 - 1)x + 1',
          'Đạo hàm bậc nhất: y\' = 3x^2 - 6mx + 3(m^2 - 1) = 3[x^2 - 2mx + m^2 - 1]',
          'Tham số thực m',
          'Hai điểm cực trị: x_1 = m - 1 (cực đại), x_2 = m + 1 (cực tiểu)'
        ],
        geometricRelations: [
          'Biệt thức Δ\' = m^2 - (m^2 - 1) = 1 > 0 với mọi m',
          'Hàm số luôn luôn có hai điểm cực trị phân biệt với mọi giá trị của tham số m',
          'Khoảng cách giữa hai hoành độ cực trị luôn cố định: |x_2 - x_1| = 2 không phụ thuộc vào m',
          'Điểm uốn của đồ thị là I(m; -2m + 1)'
        ],
        problemSummary: 'Bài toán khảo sát hàm số bậc ba kinh điển trong chương trình Toán 12, minh họa trực quan sự tịnh tiến của đồ thị và khoảng cách bất biến giữa hai điểm cực trị.'
      },
      modelType: 'algebra_2d',
      algebra2D: {
        functionExpression: 'y = x^3 - 3mx^2 + 3(m^2 - 1)x + 1',
        parameterName: 'm',
        minParam: -3,
        maxParam: 3,
        defaultParam: 0,
        extremaDescription: 'Cực đại tại x = m - 1, Cực tiểu tại x = m + 1. Độ dài đoạn nối hai cực trị hoặc khoảng cách hoành độ luôn là hằng số.',
        tableOfVariations: 'x từ -∞ đến m-1 (đồng biến), m-1 đến m+1 (nghịch biến), m+1 đến +∞ (đồng biến)'
      },
      pedagogicalScript: {
        steps: [
          {
            stepNumber: 1,
            title: 'Tập xác định và tính đạo hàm y\'',
            description: 'Tập xác định D = R. Tính đạo hàm y\' = 3x^2 - 6mx + 3(m^2 - 1).',
            teacherQuestion: 'Phương trình y\' = 0 có bao nhiêu nghiệm và dấu của Δ\' như thế nào?'
          },
          {
            stepNumber: 2,
            title: 'Tìm nghiệm của y\' = 0 và biện luận cực trị',
            description: 'Ta có Δ\' = 1 > 0 với mọi m. Phương trình y\' = 0 có hai nghiệm phân biệt x1 = m - 1 và x2 = m + 1.',
            teacherQuestion: 'Tại sao đồ thị luôn có cực đại và cực tiểu với mọi giá trị thực của m?'
          },
          {
            stepNumber: 3,
            title: 'Lập bảng biến thiên và xác định tọa độ điểm cực trị',
            description: 'Hàm số đồng biến trên (-∞; m-1) và (m+1; +∞), nghịch biến trên (m-1; m+1).',
            teacherQuestion: 'Khi m thay đổi trên thanh trượt, quỹ tích điểm uốn I di chuyển trên đường thẳng nào?'
          },
          {
            stepNumber: 4,
            title: 'Mô phỏng đồ thị trực quan và thay đổi tham số m',
            description: 'Kéo thanh trượt tham số m để học sinh quan sát đồ thị trượt trong mặt phẳng Oxy trong khi khoảng cách hoành độ giữa hai cực trị luôn bằng 2.',
            teacherQuestion: 'Em có nhận xét gì về hình dạng đường cong khi tham số m tăng dần?'
          }
        ],
        keyTeachingGoal: 'Hiểu bản chất hình học của tham số m đối với sự biến thiên của đồ thị và rèn luyện kỹ năng quan sát hàm số động.'
      },
      exportData: {
        latexExercise: `\\begin{exercise}
Cho hàm số $y = x^3 - 3mx^2 + 3(m^2 - 1)x + 1$ với $m$ là tham số.
\\begin{enumerate}[a)]
  \\item Chứng minh rằng đồ thị hàm số luôn có hai điểm cực trị với mọi $m$.
  \\item Tìm tập hợp quỹ tích điểm uốn của đồ thị hàm số khi $m$ thay đổi.
\\end{enumerate}
\\end{exercise}
\\begin{solution}
Ta có $y' = 3x^2 - 6mx + 3(m^2 - 1)$.
Phương trình $y' = 0 \\Leftrightarrow x^2 - 2mx + m^2 - 1 = 0$.
Xét $\\Delta' = m^2 - (m^2 - 1) = 1 > 0, \\forall m \\in \\mathbb{R}$.
Do đó hàm số luôn có hai điểm cực trị phân biệt $x_1 = m - 1$ và $x_2 = m + 1$.
\\\\
Điểm uốn $I$ là nghiệm của $y'' = 6x - 6m = 0 \\Rightarrow x_I = m$.
Tung độ $y_I = m^3 - 3m \\cdot m^2 + 3(m^2 - 1)m + 1 = -2m + 1$.
Khử tham số $m$: $y_I = -2x_I + 1$.
Vậy khi $m$ thay đổi, quỹ tích điểm uốn là đường thẳng $d: y = -2x + 1$.
\\end{solution}`,
        svgCode: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
  <rect width="500" height="400" fill="#f8fafc" rx="12" />
  <!-- Coordinate Grid -->
  <line x1="50" y1="200" x2="450" y2="200" stroke="#cbd5e1" stroke-width="1.5" />
  <line x1="250" y1="50" x2="250" y2="350" stroke="#cbd5e1" stroke-width="1.5" />
  <!-- Arrow heads -->
  <polygon points="450,196 460,200 450,204" fill="#64748b" />
  <polygon points="246,50 250,40 254,50" fill="#64748b" />
  <text x="465" y="205" font-size="14" fill="#64748b">x</text>
  <text x="250" y="30" font-size="14" fill="#64748b">y</text>
  <text x="238" y="218" font-size="13" fill="#94a3b8">O</text>

  <!-- Cubic curve when m = 0: y = x^3 - 3x + 1 -->
  <path d="M 130,340 C 170,300 180,120 200,80 C 220,40 230,130 250,170 C 270,210 280,250 300,240 C 320,230 330,120 370,50" 
        fill="none" stroke="#2563eb" stroke-width="3" />

  <!-- Extrema dots -->
  <circle cx="200" cy="80" r="5" fill="#dc2626" />
  <text x="160" y="75" font-weight="bold" font-size="13" fill="#dc2626">CĐ (-1, 3)</text>
  
  <circle cx="300" cy="240" r="5" fill="#16a34a" />
  <text x="280" y="265" font-weight="bold" font-size="13" fill="#16a34a">CT (1, -1)</text>

  <!-- Inflection point I -->
  <circle cx="250" cy="170" r="4" fill="#9333ea" />
  <text x="260" y="165" font-weight="bold" font-size="13" fill="#9333ea">I(0, 1)</text>
</svg>`,
        geogebraScript: `// Desmos or GeoGebra
m = 0
f(x) = x^3 - 3*m*x^2 + 3*(m^2 - 1)*x + 1
Extremum(f)
InflectionPoint(f)`
      },
      teacherNotes: [
        'Học sinh hay tính sai biểu thức đạo hàm y\' dẫn đến hiểu sai về Δ\'.',
        'Cần nhấn mạnh rằng bài toán yêu cầu tìm cực trị "với mọi m", vì vậy Δ\' phải luôn dương không phụ thuộc vào m.',
        'Thao tác trực quan trên đồ thị giúp học sinh thấy rõ quỹ tích điểm uốn chuyển động trên đường thẳng y = -2x + 1.'
      ]
    }
  }
];

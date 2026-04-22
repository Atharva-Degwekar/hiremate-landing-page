import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Session = {
  role: string;
  difficulty: string;
  overall_score: number | null;
  category_scores: Record<string, number> | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  next_steps: string[] | null;
  benchmark_percentile: number | null;
  filler_count: number | null;
  pace_wpm: number | null;
  duration_seconds: number | null;
  created_at: string;
};

type Turn = {
  question_index: number;
  question: string;
  answer: string | null;
  score: number | null;
  feedback: string | null;
};

export function generatePdfReport(session: Session, turns: Turn[], userName: string) {
  const doc = new jsPDF();
  const W = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(231, 76, 60);
  doc.rect(0, 0, W, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("HireMate Interview Report", 14, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(session.created_at).toLocaleString(), W - 14, 18, { align: "right" });

  // Candidate
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(11);
  doc.text(`Candidate: ${userName}`, 14, 38);
  doc.text(`Role: ${session.role} • Difficulty: ${session.difficulty}`, 14, 44);

  // Overall score box
  doc.setDrawColor(229, 231, 235);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, 50, W - 28, 28, 3, 3, "FD");
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text("OVERALL SCORE", 20, 60);
  doc.setFontSize(28);
  doc.setTextColor(231, 76, 60);
  doc.setFont("helvetica", "bold");
  doc.text(`${session.overall_score ?? "—"}`, 20, 73);
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.text(`Top ${100 - (session.benchmark_percentile ?? 50)}%`, 60, 73);
  doc.text(`Filler words: ${session.filler_count ?? 0}`, 100, 65);
  doc.text(`Pace: ${session.pace_wpm ?? 0} wpm`, 100, 72);
  doc.text(`Duration: ${Math.round((session.duration_seconds ?? 0) / 60)} min`, 150, 65);

  // Category scores table
  let y = 88;
  if (session.category_scores) {
    autoTable(doc, {
      startY: y,
      head: [["Category", "Score"]],
      body: Object.entries(session.category_scores).map(([k, v]) => [
        k.charAt(0).toUpperCase() + k.slice(1),
        String(v),
      ]),
      headStyles: { fillColor: [31, 41, 55] },
      styles: { fontSize: 10 },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  const list = (title: string, items: string[] | null, color: [number, number, number]) => {
    if (!items?.length) return;
    doc.setFontSize(12);
    doc.setTextColor(...color);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, y);
    y += 6;
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.setFont("helvetica", "normal");
    for (const item of items) {
      const lines = doc.splitTextToSize(`• ${item}`, W - 28);
      if (y + lines.length * 5 > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, 14, y);
      y += lines.length * 5 + 1;
    }
    y += 4;
  };

  list("Strengths", session.strengths, [16, 185, 129]);
  list("Areas to improve", session.weaknesses, [231, 76, 60]);
  list("Next steps", session.next_steps, [249, 115, 22]);

  // Per-question
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.setFont("helvetica", "bold");
  doc.text("Per-question breakdown", 14, 20);
  let qy = 28;
  for (const t of turns) {
    if (qy > 260) {
      doc.addPage();
      qy = 20;
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(231, 76, 60);
    doc.text(`Q${t.question_index + 1}  •  Score ${t.score ?? "—"}`, 14, qy);
    qy += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);
    const qLines = doc.splitTextToSize(t.question, W - 28);
    doc.text(qLines, 14, qy);
    qy += qLines.length * 5 + 2;
    if (t.answer) {
      doc.setTextColor(75, 85, 99);
      const aLines = doc.splitTextToSize(`Answer: ${t.answer}`, W - 28);
      doc.text(aLines, 14, qy);
      qy += aLines.length * 5 + 2;
    }
    if (t.feedback) {
      doc.setTextColor(31, 41, 55);
      const fLines = doc.splitTextToSize(`Feedback: ${t.feedback}`, W - 28);
      doc.text(fLines, 14, qy);
      qy += fLines.length * 5 + 6;
    }
  }

  doc.save(`HireMate-Report-${session.role}-${new Date(session.created_at).toISOString().slice(0, 10)}.pdf`);
}

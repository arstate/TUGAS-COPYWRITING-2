import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideComponent } from './components/slide/slide.component';
import { Slide, MindmapNode } from './slide.interface';

declare var html2canvas: any;
declare var jspdf: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SlideComponent],
})
export class AppComponent {
  
  private readonly mindmapData: MindmapNode = {
    center: 'Keahlian Inti Copywriter',
    branches: [
      { title: 'Kreativitas Tinggi', text: 'Mampu menghasilkan ide-ide yang orisinal dan segar untuk iklan.' },
      { title: 'Kemampuan Menulis', text: 'Bisa menulis dengan gaya yang mengalir, sederhana, dan menyesuaikan dengan target audiens.' },
      { title: 'Keterampilan Riset', text: 'Mampu menganalisis produk, target pasar, dan kompetitor sebelum menulis.' },
      { title: 'Pemahaman Audiens', text: 'Bisa menggunakan bahasa yang "nyambung" dan familier dengan target pasarnya.' },
      { title: 'Ahli Membuat Headline', text: 'Mampu menciptakan judul yang menarik perhatian dan membuat orang penasaran.' },
      { title: 'Paham Karakteristik Media', text: 'Mengerti cara menulis yang efektif untuk berbagai platform (Instagram vs. billboard).' }
    ]
  };

  slides = signal<Slide[]>([
    {
      type: 'title',
      title: 'Copywriting',
      subtitle: 'BACHTIAR ARYANSYAH PUTRA (24091367032)'
    },
    {
      type: 'question',
      title: 'Pertanyaan 1',
      content: 'Jelaskan sosok copywriter di era digital? Ruang lingkup kerjanya dapat masuk di bidang apa saja?'
    },
    {
      type: 'answer',
      title: 'Jawaban 1',
      content: 'Menurut saya, copywriter di era digital itu bukan cuma tukang tulis. Mereka adalah pemikir kreatif yang tugas utamanya melahirkan ide besar untuk sebuah iklan atau kampanye.'
    },
    {
      type: 'question',
      title: 'Pertanyaan 2',
      content: 'Sebutkan sosok copywriter yang menginspirasimu! Jelaskan dalam 3 (tiga) paragraf pengalaman dan sepak terjangnya yang menginspirasimu!'
    },
    {
      type: 'answer',
      title: 'Jawaban 2',
      content: [
        'Sosok copywriter sekaligus praktisi branding yang sangat menginspirasi saya adalah Subiakto Priosoedarsono. Beliau dikenal sebagai salah satu "Bapak Branding Indonesia" yang karyanya sudah terbukti melahirkan banyak merek legendaris di tanah air. Yang membuat saya kagum adalah kemampuannya meramu kata-kata sederhana yang tidak hanya menjual, tetapi juga mampu membangun identitas dan "roh" sebuah merek hingga melekat di benak masyarakat selama puluhan tahun.',
        'Beliau adalah sosok di balik kesuksesan banyak merek ikonik seperti Indomie dengan slogan "Seleraku", Kopiko yang diposisikan sebagai "gantinya ngopi", dan Teh Botol Sosro.',
        'Beliau tidak sekadar membuat iklan, tetapi menggali esensi terdalam dari sebuah produk dan menerjemahkannya menjadi pesan yang begitu kuat dan mudah dicerna oleh pasar. Beliau membuktikan bahwa kata-kata yang tepat bisa mengubah produk biasa menjadi bagian dari budaya populer. Bagi saya, ini adalah pelajaran paling berharga bahwa tujuan akhir seorang copywriter bukan hanya menciptakan slogan yang viral sesaat, tetapi membangun komunikasi yang jujur, relevan, dan abadi.'
      ]
    },
    {
      type: 'question',
      title: 'Pertanyaan 3',
      content: 'Apa perbedaan copywriter dan content writer? Jelaskan dalam bentuk tabel!'
    },
    {
      type: 'table',
      title: 'Jawaban 3: Perbedaan Copywriter dan Content Writer',
      tableHeaders: ['Kriteria', 'Copywriter', 'Content Writer'],
      tableRows: [
        [
          'Tujuan',
          'Menjual & Meyakinkan. Tujuannya jangka pendek, yaitu agar pembaca langsung melakukan aksi (membeli, daftar, dll).',
          'Menginformasikan & Mengedukasi. Tujuannya jangka panjang, yaitu membangun kepercayaan dan loyalitas audiens.'
        ],
        [
          'Gaya Tulisan',
          'Cenderung pendek, persuasif, emosional, dan mudah diingat. Fokus pada headline yang kuat.',
          'Biasanya panjang, detail, dan informatif. Fokus pada data, riset, dan kaidah SEO.'
        ],
        [
          'Media',
          'Iklan di media sosial, billboard, banner di website, naskah iklan radio/TV.',
          'Artikel blog, e-book, white paper, studi kasus.'
        ]
      ]
    },
    {
      type: 'question',
      title: 'Pertanyaan 4',
      content: 'Apa saja yang harus dimiliki copywriter? Jelaskan dalam bentuk mindmapp!'
    },
    {
      type: 'mindmap',
      mindmap: this.mindmapData
    },
    {
      type: 'final',
      title: 'Terima Kasih'
    }
  ]);

  currentSlideIndex = signal(0);
  isGeneratingPdf = signal(false);
  
  readonly totalSlides = computed(() => this.slides().length);
  readonly currentSlide = computed(() => this.slides()[this.currentSlideIndex()]);
  readonly isFirstSlide = computed(() => this.currentSlideIndex() === 0);
  readonly isLastSlide = computed(() => this.currentSlideIndex() === this.totalSlides() - 1);

  nextSlide(): void {
    this.currentSlideIndex.update(index => Math.min(index + 1, this.totalSlides() - 1));
  }

  previousSlide(): void {
    this.currentSlideIndex.update(index => Math.max(index - 1, 0));
  }

  async downloadPdf(): Promise<void> {
    this.isGeneratingPdf.set(true);
    const originalIndex = this.currentSlideIndex();

    // Allow UI to update to "generating" state
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const { jsPDF } = jspdf;
      // PDF page with 16:9 aspect ratio
      const pdf = new jsPDF('landscape', 'px', [1280, 720]);
      const elementToCapture = document.getElementById('presentation-wrapper');

      if (!elementToCapture) {
        throw new Error('Presentation container not found. PDF generation failed.');
      }

      for (const [index] of this.slides().entries()) {
        this.currentSlideIndex.set(index);

        // Wait for DOM update and next browser paint to ensure slide is fully rendered
        await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 50)));

        const canvas = await html2canvas(elementToCapture, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          backgroundColor: '#000000', // Use a solid background to avoid issues with transparency
        });
        const imgData = canvas.toDataURL('image/png');

        if (index > 0) {
          pdf.addPage([1280, 720], 'landscape');
        }
        pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      }

      pdf.save('copywriting-presentation.pdf');
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      // Restore original state
      this.currentSlideIndex.set(originalIndex);
      this.isGeneratingPdf.set(false);
    }
  }
}
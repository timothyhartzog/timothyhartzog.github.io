import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TabStopType,
  TabStopPosition,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
} from 'docx';
import fs from 'node:fs';

const lightBlue = '38BDF8';
const darkBg = 'F1F5F9';
const borderColor = 'CBD5E1';

function metadataRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: darkBg },
        borders: cellBorders(),
        children: [
          new Paragraph({
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({ text: label, bold: true, size: 22, font: 'Calibri' }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 75, type: WidthType.PERCENTAGE },
        borders: cellBorders(),
        children: [
          new Paragraph({
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({ text: value, size: 22, font: 'Calibri', color: '64748B' }),
            ],
          }),
        ],
      }),
    ],
  });
}

function cellBorders() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: borderColor };
  return { top: border, bottom: border, left: border, right: border };
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 24 },
      },
      heading1: {
        run: { font: 'Calibri', size: 36, bold: true, color: '0F172A' },
        paragraph: { spacing: { before: 360, after: 120 } },
      },
      heading2: {
        run: { font: 'Calibri', size: 30, bold: true, color: '1E293B' },
        paragraph: { spacing: { before: 280, after: 100 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        // Header
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: 'Hartzog', size: 32, bold: true, font: 'Calibri' }),
            new TextRun({ text: '.ai', size: 32, bold: true, font: 'Calibri', color: lightBlue }),
            new TextRun({ text: '  —  Blog Post Template', size: 24, font: 'Calibri', color: '64748B' }),
          ],
        }),
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: lightBlue } },
          spacing: { after: 300 },
          children: [],
        }),

        // Instructions
        new Paragraph({
          spacing: { after: 200 },
          shading: { type: ShadingType.SOLID, color: 'FFFBEB' },
          children: [
            new TextRun({
              text: 'Instructions: ',
              bold: true,
              size: 20,
              font: 'Calibri',
            }),
            new TextRun({
              text: 'Fill in the metadata table below, then write your post content under each section heading. When finished, export/save as needed. The metadata fields map directly to the blog frontmatter.',
              size: 20,
              font: 'Calibri',
              color: '92400E',
            }),
          ],
        }),

        // Metadata table
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: 'Post Metadata' })],
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            metadataRow('Title', 'Your Post Title Here'),
            metadataRow('Description', 'A short summary of your post (1–2 sentences)'),
            metadataRow('Date', new Date().toISOString().split('T')[0]),
            metadataRow('Tags', 'tag1, tag2, tag3'),
            metadataRow('Filename', 'my-post-slug'),
          ],
        }),

        // Spacing
        new Paragraph({ spacing: { before: 400 }, children: [] }),

        // Content section
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: 'Post Content' })],
        }),
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: borderColor } },
          spacing: { after: 200 },
          children: [],
        }),

        // Introduction
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: 'Introduction' })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Write your opening paragraph here. Set the context for your readers and explain what this post covers.',
              color: '94A3B8',
              italics: true,
            }),
          ],
        }),

        // Main body
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: 'Main Section' })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Write the core content of your post here. You can add more headings by using Heading 1 or Heading 2 styles in Word.',
              color: '94A3B8',
              italics: true,
            }),
          ],
        }),

        // Key takeaways
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: 'Key Takeaways' })],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: '• First key takeaway',
              color: '94A3B8',
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: '• Second key takeaway',
              color: '94A3B8',
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: '• Third key takeaway',
              color: '94A3B8',
              italics: true,
            }),
          ],
        }),

        // Conclusion
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: 'Conclusion' })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Wrap up your post. Summarize the main points and include any call to action.',
              color: '94A3B8',
              italics: true,
            }),
          ],
        }),

        // Footer
        new Paragraph({ spacing: { before: 400 }, children: [] }),
        new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: borderColor } },
          spacing: { before: 200 },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'Once complete, convert this to Markdown and save as src/content/blog/<filename>.md',
              size: 18,
              color: '94A3B8',
              italics: true,
              font: 'Calibri',
            }),
          ],
        }),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync('blog-post-template.docx', buffer);
console.log('Created: blog-post-template.docx');

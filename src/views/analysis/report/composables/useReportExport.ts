import { ref, type Ref } from 'vue'
import { asBlob } from 'html-docx-js-typescript'
import { saveAs } from 'file-saver'

export function useReportExport(reportRef: Ref<HTMLElement | null>) {
  const exportLoading = ref(false)

  const getExportStyles = () => {
    return `
      body { font-family: 'SimSun', serif; color: #333; line-height: 1.5; }
      h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; font-weight: bold; }
      
      /* Report Header */
      .report-header { 
        padding: 24px; 
        background-color: #1890ff; 
        color: white; 
        margin-bottom: 24px; 
        text-align: center;
        border-radius: 8px;
      }
      .report-header .title { 
        font-size: 28px; 
        margin-bottom: 10px; 
        color: white;
      }
      .report-header .subtitle { 
        font-size: 16px; 
        color: #e6f7ff; 
        margin-bottom: 16px;
      }
      .report-meta { 
        font-size: 14px; 
        color: #e6f7ff; 
        display: flex;
        justify-content: center;
        gap: 20px;
      }
      
      /* Section Common */
      .report-section { 
        margin-bottom: 30px; 
        page-break-inside: avoid;
      }
      .section-header { 
        border-bottom: 2px solid #f0f0f0; 
        padding-bottom: 10px; 
        margin-bottom: 20px; 
      }
      .section-title { 
        font-size: 18px; 
        font-weight: bold; 
        color: #333; 
        border-left: 4px solid #1890ff;
        padding-left: 10px;
      }
      .section-icon { display: none; }

      /* Summary Cards */
      .summary-cards { 
        display: table; /* Use table for layout in Word */
        width: 100%;
        border-collapse: separate;
        border-spacing: 15px;
        margin-top: 10px;
      }
      .summary-card { 
        display: table-cell;
        width: 25%;
        padding: 20px; 
        border-radius: 8px; 
        vertical-align: top;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      /* Card Specific Colors */
      .summary-card.total {
        background-color: #e6f7ff;
        border: 1px solid #91d5ff;
      }
      .summary-card.danger {
        background-color: #fff1f0;
        border: 1px solid #ffa39e;
      }
      .summary-card.warning {
        background-color: #fffbe6;
        border: 1px solid #ffe58f;
      }
      .summary-card.info {
        background-color: #f9f0ff;
        border: 1px solid #d3adf7;
      }

      .card-icon { display: none; }
      
      .card-label { 
        color: #666; 
        font-size: 14px; 
        font-weight: bold;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .card-value { 
        font-size: 28px; 
        font-weight: bold; 
        margin: 12px 0; 
        font-family: Arial, sans-serif;
      }
      /* Value Colors */
      .summary-card.total .card-value { color: #1890ff; }
      .summary-card.danger .card-value { color: #cf1322; }
      .summary-card.warning .card-value { color: #d48806; }
      .summary-card.info .card-value { color: #722ed1; }

      .card-desc { 
        color: #888; 
        font-size: 12px; 
        margin-top: 8px; 
        line-height: 1.4;
        border-top: 1px dashed rgba(0,0,0,0.1);
        padding-top: 8px;
      }

      /* Charts Layout */
      .chart-row { 
        width: 100%;
        margin-bottom: 20px; 
      }
      .chart-item { 
        margin-bottom: 20px;
        border: 1px solid #f0f0f0;
        padding: 10px;
      }
      .chart-item h4 {
        text-align: center;
        margin-bottom: 10px;
        font-size: 16px;
        color: #333;
      }
      img { max-width: 100%; height: auto; display: block; margin: 0 auto; }

      /* Table Styles */
      table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
      th { 
        background-color: #fafafa; 
        border: 1px solid #e8e8e8; 
        padding: 10px; 
        text-align: left; 
        font-weight: bold; 
        color: #333;
      }
      td { 
        border: 1px solid #e8e8e8; 
        padding: 10px; 
        color: #666;
      }
      
      /* Ant Design Tag Simulation */
      .ant-tag {
        display: inline-block;
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        background: #fafafa;
      }
      .ant-tag-red { background: #fff1f0; border-color: #ffa39e; color: #cf1322; }
      .ant-tag-orange { background: #fff7e6; border-color: #ffd591; color: #d46b08; }
      .ant-tag-blue { background: #e6f7ff; border-color: #91d5ff; color: #096dd9; }
    `
  }

  const exportReport = async (fileName: string) => {
    if (!reportRef.value) return
    exportLoading.value = true
    try {
      // 1. Clone the report element
      const clone = reportRef.value.cloneNode(true) as HTMLElement

      // 2. Remove elements with 'export-ignore' class
      const ignoredElements = clone.querySelectorAll('.export-ignore')
      ignoredElements.forEach((el) => el.remove())

      // 3. Handle Charts (Canvas to Image)
      // Find all chart containers in the original live DOM
      const liveChartContainers = reportRef.value.querySelectorAll('.chart-inner')
      // Find all chart containers in the clone
      const clonedChartContainers = clone.querySelectorAll('.chart-inner')

      // Replace canvas with image in clone
      for (let i = 0; i < liveChartContainers.length; i++) {
        const liveContainer = liveChartContainers[i]
        const clonedContainer = clonedChartContainers[i]
        if (!liveContainer || !clonedContainer) continue

        const canvas = liveContainer.querySelector('canvas')

        if (canvas instanceof HTMLCanvasElement && clonedContainer) {
          // 创建一个新的 Canvas 来调整大小
          const scaledCanvas = document.createElement('canvas')
          const ctx = scaledCanvas.getContext('2d')
          
          // 设置目标尺寸（例如宽度限制在 600px 以内）
          const maxWidth = 600
          const scaleFactor = Math.min(1, maxWidth / canvas.width)
          
          scaledCanvas.width = canvas.width * scaleFactor
          scaledCanvas.height = canvas.height * scaleFactor

          if (ctx) {
            ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height)
            const dataURL = scaledCanvas.toDataURL('image/png')
            
            // 创建图片元素
            const img = document.createElement('img')
            img.src = dataURL
            // 确保图片在文档中不超过页面宽度
            img.style.width = '100%' 
            img.style.maxWidth = '600px' // 限制最大显示宽度
            
            // 清空克隆容器并添加图片
            clonedContainer.innerHTML = ''
            clonedContainer.appendChild(img)
          }
        }
      }

      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
               ${getExportStyles()}
            </style>
          </head>
          <body>
            <div style="width: 800px; margin: 0 auto;">
              ${clone.innerHTML}
            </div>
          </body>
        </html>
      `
      const blob = (await asBlob(content, {
        orientation: 'portrait',
        margins: { top: 720, right: 720, bottom: 720, left: 720 },
      })) as Blob
      // 4. 触发下载
      saveAs(blob, fileName)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      exportLoading.value = false
    }
  }

  return {
    exportLoading,
    exportReport,
  }
}

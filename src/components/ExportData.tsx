import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportDataProps {
  userData: any;
  stats: any;
}

export const ExportData: React.FC<ExportDataProps> = ({ userData, stats }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(41, 109, 193);
      pdf.text('CFAnalytics Report', pageWidth / 2, 25, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`User: ${userData.userInfo.handle}`, pageWidth / 2, 35, { align: 'center' });
      
      // User Info Section
      let yPosition = 50;
      pdf.setFontSize(14);
      pdf.setTextColor(41, 109, 193);
      pdf.text('User Information', 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Handle: ${userData.userInfo.handle}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Rank: ${userData.userInfo.rank || 'unrated'}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Current Rating: ${userData.userInfo.rating || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Max Rating: ${userData.userInfo.maxRating || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Country: ${userData.userInfo.country || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`City: ${userData.userInfo.city || 'N/A'}`, 20, yPosition);
      
      // Statistics Section
      yPosition += 15;
      pdf.setFontSize(14);
      pdf.setTextColor(41, 109, 193);
      pdf.text('Performance Statistics', 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Problems Solved: ${stats.solvedProblems}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Contests Participated: ${stats.contestsParticipated}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Average Attempts per Problem: ${stats.averageAttempts}`, 20, yPosition);
      
      // Submissions Analysis
      yPosition += 15;
      pdf.setFontSize(14);
      pdf.setTextColor(41, 109, 193);
      pdf.text('Submission Analysis', 20, yPosition);
      
      const verdictCounts = userData.submissions.reduce((acc: any, sub: any) => {
        acc[sub.verdict] = (acc[sub.verdict] || 0) + 1;
        return acc;
      }, {});
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      Object.entries(verdictCounts).slice(0, 8).forEach(([verdict, count]) => {
        pdf.text(`${verdict}: ${count}`, 20, yPosition);
        yPosition += 6;
      });
      
      // Language Analysis
      yPosition += 15;
      pdf.setFontSize(14);
      pdf.setTextColor(41, 109, 193);
      pdf.text('Programming Languages', 20, yPosition);
      
      const languageCounts = userData.submissions.reduce((acc: any, sub: any) => {
        acc[sub.programmingLanguage] = (acc[sub.programmingLanguage] || 0) + 1;
        return acc;
      }, {});
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      Object.entries(languageCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 10)
        .forEach(([lang, count]) => {
          pdf.text(`${lang}: ${count} submissions`, 20, yPosition);
          yPosition += 6;
        });
      
      // Contest Performance
      if (userData.contests.length > 0) {
        yPosition += 15;
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(14);
        pdf.setTextColor(41, 109, 193);
        pdf.text('Contest Performance', 20, yPosition);
        
        yPosition += 10;
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        
        const bestRating = Math.max(...userData.contests.map((c: any) => c.newRating));
        const worstRating = Math.min(...userData.contests.map((c: any) => c.newRating));
        const avgRatingChange = userData.contests.reduce((sum: number, c: any) => 
          sum + (c.newRating - c.oldRating), 0) / userData.contests.length;
        
        pdf.text(`Best Rating: ${bestRating}`, 20, yPosition);
        yPosition += 6;
        pdf.text(`Worst Rating: ${worstRating}`, 20, yPosition);
        yPosition += 6;
        pdf.text(`Average Rating Change: ${avgRatingChange.toFixed(2)}`, 20, yPosition);
      }
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated on ${new Date().toLocaleDateString()} by CFAnalytix`, 
               pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      pdf.save(`${userData.userInfo.handle}-codeforces-report.pdf`);
      
      toast({
        title: "Export Successful",
        description: "Your Codeforces report has been downloaded as PDF.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export Analytics
        </CardTitle>
        <CardDescription>
          Download your complete performance report as PDF
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Your report will include:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Complete user profile and statistics</li>
              <li>• Submission analysis by verdict and language</li>
              <li>• Contest performance metrics</li>
              <li>• Rating progression history</li>
              <li>• Problem difficulty breakdown</li>
            </ul>
          </div>
          
          <Button 
            onClick={generatePDF}
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PDF Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

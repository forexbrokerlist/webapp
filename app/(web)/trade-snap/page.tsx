'use client'
import { AlertCircle, ArrowDownRight, ArrowUpRight, BarChart3, Camera, Clock, Eye, Monitor, MonitorOff, Play, Square, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/web/ui/dialog";
import { motion } from "framer-motion";
import { useToast } from "@/components/web/ui/use-toast";
import React from "react";

function Dashboard() {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [allAnalyses, setAllAnalyses] = useState<{ data: any[]; timestamp: string }[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoCaptureInterval, setAutoCaptureInterval] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'multi'>('single');
  const [isSharing2, setIsSharing2] = useState(false);
  const [stream2, setStream2] = useState<MediaStream | null>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [showTabSwitchConfirm, setShowTabSwitchConfirm] = useState(false);
  const [pendingTab, setPendingTab] = useState<'single' | 'multi' | null>(null);
  const [autoCaptureInterval1, setAutoCaptureInterval1] = useState<number | null>(null);
  const [autoCaptureInterval2, setAutoCaptureInterval2] = useState<number | null>(null);
  const [capturedImage1, setCapturedImage1] = useState<string | null>(null);
  const [capturedImage2, setCapturedImage2] = useState<string | null>(null);
  const [isAnalyzing1, setIsAnalyzing1] = useState(false);
  const [isAnalyzing2, setIsAnalyzing2] = useState(false);
  const [showSnapshot1, setShowSnapshot1] = useState(false);
  const [showSnapshot2, setShowSnapshot2] = useState(false);
  const [allAnalyses1, setAllAnalyses1] = useState<{ data: any[]; timestamp: string }[]>([]);
  const [allAnalyses2, setAllAnalyses2] = useState<{ data: any[]; timestamp: string }[]>([]);
  const [shouldAutoAnalyze, setShouldAutoAnalyze] = useState(false);
  const { toast } = useToast();
  const [nextScreenshotEndTime, setNextScreenshotEndTime] = useState<number | null>(null);
  const [nextScreenshotEndTime1, setNextScreenshotEndTime1] = useState<number | null>(null);
  const [nextScreenshotEndTime2, setNextScreenshotEndTime2] = useState<number | null>(null);
  const [shouldAutoAnalyze1, setShouldAutoAnalyze1] = useState(false);
  const [shouldAutoAnalyze2, setShouldAutoAnalyze2] = useState(false);

  const lastCapture1 = useRef(Date.now());
  const lastCapture2 = useRef(Date.now());
  console.log("capturedImagess", capturedImage)
  const startScreenShare = useCallback(async () => {
    try {
      setError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen sharing is not supported in this browser');
      }

      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: true,
        selfBrowserSurface: 'include',

      } as DisplayMediaStreamOptions & { selfBrowserSurface?: string });

      setStream(mediaStream);
      setIsSharing(true);

      // Handle when user stops sharing via browser controls
      mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });

      // Set video source after state updates
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(console.error);
      }

      setTimeout(() => {
        window.focus();
        // Additional attempt to bring focus back
        if (document.hidden) {
          // Try to bring the tab to focus
          window.focus();
        }
      }, 1000);

      // Also try to focus immediately
      setTimeout(() => window.focus(), 100);

    } catch (err) {
      console.error('Error starting screen share:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Screen sharing permission was denied. Please allow access and try again.');
        } else if (err.name === 'NotSupportedError') {
          setError('Screen sharing is not supported in this browser.');
        } else if (err.name === 'NotFoundError') {
          setError('No screen sharing source was selected.');
        } else {
          setError(err.message || 'Failed to start screen sharing');
        }
      } else {
        setError('An unexpected error occurred while starting screen share');
      }
    }
  }, []);


  const stopScreenShare = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsSharing(false);
    setError(null);
    setCapturedImage(null);
    setAllAnalyses([])
    setShowAnalysis(false);
    setShowSnapshot(false);
    setAutoCaptureInterval(null);
  }, [stream]);

  const captureScreenshot = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Unable to capture screenshot - video not available');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('Unable to capture screenshot - canvas context not available');
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;

    // Draw the current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image data URL
    const imageDataUrl = canvas.toDataURL('image/png', 1.0);
    setCapturedImage(imageDataUrl);

    // Keep the analysis section visible but clear the current result
    // The previous analysis history will remain visible

    // setAllAnalyses([])
    // Clear any previous errors
    setError(null);
    setShowSnapshot(true);
  }, []);



  const analyzeImage = async () => {
    try {
      console.log("analyzeImage called");
      console.log("capturedImage exists:", !!capturedImage);
      console.log("isAnalyzing:", isAnalyzing);

      if (!capturedImage) {
        console.log("capturedImage", capturedImage)
        setError('No image captured');
        return;
      }

      setIsAnalyzing(true);
      console.log("Starting analysis...");

      // Convert base64 to blob
      const blob = await fetch(capturedImage).then(res => res.blob());

      const formData = new FormData();
      formData.append('files', blob, 'screenshot.png');

      // Get user_id from localStorage if it exists
      const userId = localStorage.getItem('user_id');
      if (userId) {
        formData.append('user_id', userId);
      }

      const response = await fetch('https://api-chart-analysis.rejoicehub.com/analyze', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      console.log('API Response:', result); // Log the full API response

      // Handle case when no valid chart is found in the image
      if (result.ai_response?.error) {
        setError(result.ai_response.raw || 'No valid chart found in the image');
        setShowAnalysis(false);
        setShowSnapshot(true);
        return;
      }

      // If the API returns a user_id and we don't have it in localStorage yet
      if (result.user_id && !localStorage.getItem('user_id')) {
        console.log('Storing new user ID:', result.user_id);
        localStorage.setItem('user_id', result.user_id);
      }

      // Extract the analysis data from the response
      const analysisData = result.ai_response;

      console.log('Setting analysis result:', [analysisData]);
      const newAnalysis = {
        data: [analysisData],
        timestamp: new Date().toISOString()
      };


      // Hide the snapshot preview section when analysis is complete
      setShowAnalysis(true);
      setShowSnapshot(false);

      // Add to all analyses history
      console.log('Updating all analyses');
      setAllAnalyses(prevState => [newAnalysis, ...prevState]);

    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Effect to handle video stream updates
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
      setTimeout(() => window.focus(), 2000);
    }
  }, [stream]);

  const toggleScreenShare = useCallback(() => {
    if (isSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  }, [isSharing, startScreenShare, stopScreenShare]);



  const startScreenShare2 = useCallback(async () => {
    try {
      setError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen sharing is not supported in this browser');
      }
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: true,
        selfBrowserSurface: 'include',
      } as DisplayMediaStreamOptions & { selfBrowserSurface?: string });
      setStream2(mediaStream);
      setIsSharing2(true);
      mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare2();
      });
      if (videoRef2.current) {
        videoRef2.current.srcObject = mediaStream;
        videoRef2.current.play().catch(console.error);
      }
      setTimeout(() => window.focus(), 1000);
      setTimeout(() => window.focus(), 100);
    } catch (err) {
      console.error('Error starting screen share 2:', err);
      setError(err instanceof Error ? err.message : 'Failed to start screen sharing 2');
    }
  }, []);

  const stopScreenShare2 = useCallback(() => {
    if (stream2) {
      stream2.getTracks().forEach(track => track.stop());
      setStream2(null);
    }
    if (videoRef2.current) {
      videoRef2.current.srcObject = null;
    }
    setIsSharing2(false);
  }, [stream2]);

  // Effect to handle video stream updates for stream2
  useEffect(() => {
    if (videoRef2.current && stream2) {
      videoRef2.current.srcObject = stream2;
      videoRef2.current.play().catch(console.error);
      setTimeout(() => window.focus(), 2000);
    }
  }, [stream2]);

  // Lower timeframe capture/analyze
  const captureScreenshot1 = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Unable to capture screenshot - video not available');
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Unable to capture screenshot - canvas context not available');
      return;
    }
    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png', 1.0);
    setCapturedImage1(imageDataUrl);
    setShowSnapshot(true)
    // setAllAnalyses([]);
    setError(null);
    setShowSnapshot1(true);
  }, []);

  const analyzeImage1 = async () => {
    try {
      if (!capturedImage1 || !capturedImage2) {
        setError('No image captured');
        return;
      }
      setIsAnalyzing1(true);
      const blob = await fetch(capturedImage1).then(res => res.blob());
      const blob2 = await fetch(capturedImage2).then(res => res.blob());
      const formData = new FormData();
      formData.append('files', blob, 'screenshot1.png');
      formData.append('files', blob2, 'screenshot2.png');
      const userId = localStorage.getItem('user_id');
      if (userId) formData.append('user_id', userId);
      const response = await fetch('https://api-chart-analysis.rejoicehub.com/analyze', {
        method: 'POST',
        headers: { 'accept': 'application/json' },
        body: formData,
      });
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
      const result = await response.json();
      if (result.ai_response?.error) {
        setError(result.ai_response.raw || 'No valid chart found in the image');
        setShowSnapshot1(true);
        return;
      }
      if (result.user_id && !localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', result.user_id);
      }
      const analysisData = result.ai_response;
      const newAnalysis = { data: [analysisData], timestamp: new Date().toISOString() };
      setShowSnapshot1(false);
      setAllAnalyses(prevState => [newAnalysis, ...prevState]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze image');
    } finally {
      setIsAnalyzing1(false);
    }
  };

  // Higher timeframe capture/analyze
  const captureScreenshot2 = useCallback(() => {
    if (!videoRef2.current || !canvasRef.current) {
      setError('Unable to capture screenshot - video not available');
      return;
    }
    const video = videoRef2.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Unable to capture screenshot - canvas context not available');
      return;
    }
    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png', 1.0);
    setCapturedImage2(imageDataUrl);
    setShowSnapshot(true)
    // setAllAnalyses([]);
    setError(null);
    setShowSnapshot2(true);
  }, []);

  useEffect(() => {
    if ((!autoCaptureInterval1) || (!isSharing)) return;

    let lastCapture1 = Date.now();

    const timer = setInterval(async () => {
      let captured = false;

      // Lower timeframe
      if (autoCaptureInterval1 && isSharing) {
        if (Date.now() - lastCapture1 >= autoCaptureInterval1 * 60 * 1000) {
          await captureScreenshot1();
          lastCapture1 = Date.now();
          captured = true;
          setNextScreenshotEndTime(Date.now() + autoCaptureInterval1 * 60 * 1000); // Restart timer visually
        }
      }



      // If any screenshot was captured, set flag for auto-analyze
      if (captured) {
        setShouldAutoAnalyze1(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [autoCaptureInterval1, isSharing, captureScreenshot1]);

  useEffect(() => {
    if (shouldAutoAnalyze1 && capturedImage1 && !isAnalyzing1) {
      analyzeImage1();
      setShouldAutoAnalyze1(false);
    }
  }, [shouldAutoAnalyze1, capturedImage1]);

  useEffect(() => {
    if ((!autoCaptureInterval2) || (!isSharing2)) return;

    let lastCapture1 = Date.now();

    const timer = setInterval(async () => {
      let captured = false;

      // Lower timeframe
      if (autoCaptureInterval2 && isSharing) {
        if (Date.now() - lastCapture1 >= autoCaptureInterval2 * 60 * 1000) {
          await captureScreenshot2();
          lastCapture1 = Date.now();
          captured = true;
          setNextScreenshotEndTime(Date.now() + autoCaptureInterval2 * 60 * 1000); // Restart timer visually
        }
      }



      // If any screenshot was captured, set flag for auto-analyze
      if (captured) {
        setShouldAutoAnalyze2(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [autoCaptureInterval2, isSharing2, captureScreenshot2]);

  useEffect(() => {
    if (shouldAutoAnalyze2 && capturedImage2 && !isAnalyzing1) {
      analyzeImage1();
      setShouldAutoAnalyze2(false);
    }
  }, [shouldAutoAnalyze2, capturedImage2]);

  // Auto-capture and analyze logic
  // useEffect(() => {
  //   if ((!autoCaptureInterval1 && !autoCaptureInterval2) || (!isSharing && !isSharing2)) return;

  //   const timer = setInterval(async () => {
  //     let captured = false;

  //     // Lower timeframe
  //     if (autoCaptureInterval1 && isSharing && !isAnalyzing1) {
  //       if (Date.now() - lastCapture1.current >= autoCaptureInterval1 * 60 * 1000) {
  //         await captureScreenshot1();
  //         lastCapture1.current = Date.now();
  //         captured = true;
  //       }
  //     }

  //     // Higher timeframe
  //     if (autoCaptureInterval2 && isSharing2 && !isAnalyzing2) {
  //       if (Date.now() - lastCapture2.current >= autoCaptureInterval2 * 60 * 1000) {
  //         await captureScreenshot2();
  //         lastCapture2.current = Date.now();
  //         captured = true;
  //       }
  //     }

  //     // If any screenshot was captured, analyze
  //     if (captured && !isAnalyzing1) {
  //       setTimeout(() => {
  //         analyzeImage1();
  //       }, 4000);
  //     }
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [autoCaptureInterval1, autoCaptureInterval2, isSharing, isSharing2, isAnalyzing1, isAnalyzing2, captureScreenshot1, captureScreenshot2]);

  useEffect(() => {
    if ((!autoCaptureInterval) || (!isSharing)) return;

    let lastCapture1 = Date.now();

    const timer = setInterval(async () => {
      let captured = false;

      // Lower timeframe
      if (autoCaptureInterval && isSharing) {
        if (Date.now() - lastCapture1 >= autoCaptureInterval * 60 * 1000) {
          await captureScreenshot();
          lastCapture1 = Date.now();
          captured = true;
          setNextScreenshotEndTime(Date.now() + autoCaptureInterval * 60 * 1000); // Restart timer visually
        }
      }



      // If any screenshot was captured, set flag for auto-analyze
      if (captured) {
        setShouldAutoAnalyze(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [autoCaptureInterval, isSharing, captureScreenshot]);

  useEffect(() => {
    if (shouldAutoAnalyze && capturedImage) {
      analyzeImage();
      setShouldAutoAnalyze(false);
    }
  }, [shouldAutoAnalyze, capturedImage]);

  // Single mode countdown effect
  useEffect(() => {
    if (!autoCaptureInterval || !isSharing) {
      setAutoCaptureInterval(null);
      return;
    }
    let lastCapture = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastCapture) / 1000);
      const remaining = autoCaptureInterval * 60 - elapsed;
      if (remaining <= 0) {
        lastCapture = Date.now();
        setAutoCaptureInterval(autoCaptureInterval);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoCaptureInterval, isSharing]);

  // Multi mode lower timeframe countdown effect
  useEffect(() => {
    if (!autoCaptureInterval1 || !isSharing) {
      setAutoCaptureInterval1(null);
      return;
    }
    let lastCapture = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastCapture) / 1000);
      const remaining = autoCaptureInterval1 * 60 - elapsed;
      if (remaining <= 0) {
        lastCapture = Date.now();
        setAutoCaptureInterval1(autoCaptureInterval1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoCaptureInterval1, isSharing]);

  // Multi mode higher timeframe countdown effect
  useEffect(() => {
    if (!autoCaptureInterval2 || !isSharing2) {
      setAutoCaptureInterval2(null);
      return;
    }
    let lastCapture = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastCapture) / 1000);
      const remaining = autoCaptureInterval2 * 60 - elapsed;
      if (remaining <= 0) {
        lastCapture = Date.now();
        setAutoCaptureInterval2(autoCaptureInterval2);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoCaptureInterval2, isSharing2]);

  // Update end time when interval or sharing changes
  useEffect(() => {
    if (autoCaptureInterval && isSharing) {
      setNextScreenshotEndTime(Date.now() + autoCaptureInterval * 60 * 1000);
    } else {
      setNextScreenshotEndTime(null);
    }
  }, [autoCaptureInterval, isSharing]);

  // Update end time when manual screenshot is taken
  const handleScreenshot = useCallback(() => {
    captureScreenshot();
    if (autoCaptureInterval) {
      setNextScreenshotEndTime(Date.now() + autoCaptureInterval * 60 * 1000);
    }
  }, [captureScreenshot, autoCaptureInterval]);

  // Lower timeframe multi: update end time when interval or sharing changes
  useEffect(() => {
    if (autoCaptureInterval1 && isSharing) {
      setNextScreenshotEndTime1(Date.now() + autoCaptureInterval1 * 60 * 1000);
    } else {
      setNextScreenshotEndTime1(null);
    }
  }, [autoCaptureInterval1, isSharing]);

  // Higher timeframe multi: update end time when interval or sharing changes
  useEffect(() => {
    if (autoCaptureInterval2 && isSharing2) {
      setNextScreenshotEndTime2(Date.now() + autoCaptureInterval2 * 60 * 1000);
    } else {
      setNextScreenshotEndTime2(null);
    }
  }, [autoCaptureInterval2, isSharing2]);

  // Lower timeframe auto-capture: update end time after auto-capture
  useEffect(() => {
    if (!autoCaptureInterval1 || !isSharing) return;
    let lastCapture = Date.now();
    const timer = setInterval(async () => {
      if (autoCaptureInterval1 && isSharing) {
        if (Date.now() - lastCapture >= autoCaptureInterval1 * 60 * 1000) {
          await captureScreenshot1();
          lastCapture = Date.now();
          setNextScreenshotEndTime1(Date.now() + autoCaptureInterval1 * 60 * 1000);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoCaptureInterval1, isSharing, captureScreenshot1]);

  // Higher timeframe auto-capture: update end time after auto-capture
  useEffect(() => {
    if (!autoCaptureInterval2 || !isSharing2) return;
    let lastCapture = Date.now();
    const timer = setInterval(async () => {
      if (autoCaptureInterval2 && isSharing2) {
        if (Date.now() - lastCapture >= autoCaptureInterval2 * 60 * 1000) {
          await captureScreenshot2();
          lastCapture = Date.now();
          setNextScreenshotEndTime2(Date.now() + autoCaptureInterval2 * 60 * 1000);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoCaptureInterval2, isSharing2, captureScreenshot2]);

  const AnalysisResultItem = ({ trade, index }: {
    trade: any;
    index: any
  }) => {
    const isBuy = trade.trade_call?.toLowerCase().includes('buy');
    const isSell = trade.trade_call?.toLowerCase().includes('sell');
    const isNoTrade = trade.trade_call.toLowerCase() === 'no_trade';

    const getConfidencePercentage = () => parseInt(trade.confidence) || 0;
    const formatSymbol = (symbol: any) => symbol.split(' - ')[0].split(' LTD')[0];

    const containerVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay: index * 0.1,
          when: "beforeChildren",
          staggerChildren: 0.1
        }
      }
    };

    const itemVariants = {
      hidden: { y: 10, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1
      }
    };

    return (
      <motion.div
        className="bg-white rounded-xl items-center justify-center shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Header */}
        <motion.div
          className="px-5 py-3"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{formatSymbol(trade.symbol)}</h3>
                <motion.span
                  className={`px-2 py-1 text-xs font-medium rounded-full 
                        bg-purple-100 text-purple-700
                      `}
                  whileHover={{ scale: 1.05 }}
                >
                  {trade.Trade.toUpperCase()}
                </motion.span>

                <motion.span
                  className="flex items-center text-xs text-gray-500"
                  variants={itemVariants}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {trade.timeframe}
                </motion.span>

              </div>
              <div className={`flex items-center justify-between gap-2 w-max mt-2 ${isBuy ? 'bg-green-100' :
                isSell ? 'bg-red-100' :
                  'bg-gray-100'
                } rounded-full`}>
                {/* Trade Signal */}
                <motion.div
                  className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg ${isBuy ? 'text-emerald-700' :
                    isSell ? 'text-red-700' :
                      'text-gray-700'
                    }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  {isBuy && <TrendingUp className="w-8 h-8" />}
                  {isSell && <TrendingDown className="w-8 h-8" />}
                  {isNoTrade && <BarChart3 className="w-8 h-8" />}
                  <span className="text-[24px] font-semibold capitalize text-center leading-[30px] relative top-[-2px]">
                    {trade.trade_call}
                  </span>
                </motion.div>

              </div>
            </motion.div>

            {/* Confidence Badge */}
            <div className="flex flex-col items-center justify-center">
              <motion.div
                className={`relative flex flex-col items-center justify-center w-[80px] h-[80px] rounded-full shadow-lg border transition-all duration-300 ${getConfidencePercentage() >= 70
                  ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-200'
                  : getConfidencePercentage() >= 40
                    ? 'bg-gradient-to-br from-amber-100 to-amber-50 border-amber-200'
                    : 'bg-gradient-to-br from-red-100 to-red-50 border-red-200'
                  }`}
                variants={itemVariants}
                whileHover={{ scale: 1.08 }}
              >
                {/* SVG Progress Ring */}
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="7"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={
                      getConfidencePercentage() >= 70
                        ? '#10b981'
                        : getConfidencePercentage() >= 40
                          ? '#f59e42'
                          : '#ef4444'
                    }
                    strokeWidth="7"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={
                      2 * Math.PI * 34 * (1 - getConfidencePercentage() / 100)
                    }
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - getConfidencePercentage() / 100) }}
                    transition={{ duration: 1 }}
                  />
                </svg>
                {/* Icon based on confidence */}
                {/* <span className="absolute top-3 left-3">
                  {getConfidencePercentage() >= 70 ? (
                    <Zap className="w-4 h-4 text-emerald-500" />
                  ) : getConfidencePercentage() >= 40 ? (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </span> */}
                {/* Confidence Percentage */}
                <motion.span
                  className={`text-xl font-extrabold z-10 ${getConfidencePercentage() >= 70
                    ? 'text-emerald-700'
                    : getConfidencePercentage() >= 40
                      ? 'text-amber-700'
                      : 'text-red-700'
                    }`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {getConfidencePercentage()}%
                </motion.span>

              </motion.div>
              <span
                className={`text-[11px] z-10 mt-1 px-2 py-0.5 rounded-full shadow-sm border
                  ${getConfidencePercentage() >= 70
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : getConfidencePercentage() >= 40
                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                      : 'bg-red-100 text-red-700 border-red-200'
                  }
                `}
              >
                Confidence
              </span>
            </div>
          </div>

        </motion.div >

        {/* Trade Details */}
        {
          !isNoTrade && (
            <motion.div
              className="px-5 pb-1 space-y-2"
              variants={itemVariants}
            >
              {/* Entry & SL */}

              <motion.div className="grid grid-cols-2 items-center gap-2 h-full" variants={itemVariants}>
                <motion.div
                  className="bg-gray-50 p-3 rounded-lg h-full"
                  whileHover={{ x: 2 }}
                >
                  <div className="text-xs text-gray-500 mb-1 font-semibold">Entry Price</div>
                  <div className="font-medium text-gray-900">
                    {trade.entry?.split('(')[0].trim() || 'N/A'}
                  </div>
                </motion.div>
                <motion.div
                  className="bg-gray-50 p-3 rounded-lg h-full"
                  whileHover={{ x: 2 }}
                >
                  <div className="text-xs text-gray-500 mb-1 font-semibold">Stop Loss</div>
                  <div className="font-medium text-red-600">{trade.stop_loss || 'N/A'}</div>
                </motion.div>
              </motion.div>

              {/* Targets */}
              <motion.div
                className="grid grid-cols-2 gap-2 items-stretch"
                variants={itemVariants}
              >
                {/* Targets */}
                <motion.div
                  className="bg-primary/10 p-3 rounded-lg h-full flex flex-col justify-between h-full"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <div className="text-xs text-primary font-medium mb-2">TARGETS</div>
                    <div className="space-y-1">
                      {Object.entries(trade.targets || {}).map(([key, value]: any, index: number) =>
                        value !== 'N/A' ? (
                          <motion.div
                            key={key}
                            className="flex items-center justify-between"
                            whileHover={{ x: 2 }}
                          >
                            <span className="text-xs text-gray-600">Target {index + 1}</span>
                            <span className="text-sm font-medium text-emerald-600">{value}</span>
                          </motion.div>
                        ) : null
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Support & Resistance */}
                <motion.div
                  className="rounded-lg h-full flex flex-col justify-between "
                  variants={itemVariants}
                >
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-semibold mb-1">Support</div>
                    <div className="text-sm font-medium text-gray-900">
                      {trade.Support_price?.split('-')[0].trim() || 'N/A'}
                    </div>
                  </div>
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-semibold mb-1">Resistance</div>
                    <div className="text-sm font-medium text-gray-900">
                      {trade.Resistance_price || 'N/A'}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

            </motion.div>
          )
        }

        {/* View Analysis Button */}
        {
          trade.rationale && (
            <motion.div
              className="px-5 pb-5"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => {
                  setSelectedAnalysis(trade);
                  setIsModalOpen(true);
                }}
                className="text-sm font-medium text-primary transition-colors duration-200 flex items-center gap-1 hover:underline w-full "

              >
                <Eye className="w-4 h-4" />
                View Detailed Analysis
              </motion.button>
            </motion.div>
          )
        }
      </motion.div >
    );
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
        duration: 2000,
      });
    }
  }, [error, toast]);

  // Timer component for isolated re-render
  // Format seconds into 'X min Y sec' format
  function formatTime(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    if (min > 0) {
      return `${min} min${min > 1 ? 's' : ''} ${sec} sec`;
    }
    return `${sec} sec`;
  }

  const NextScreenshotTimer = React.memo(
    ({ intervalMinutes, isActive, endTime }: { intervalMinutes: number; isActive: boolean; endTime: number | null }) => {
      const [secondsLeft, setSecondsLeft] = useState(
        endTime ? Math.max(0, Math.round((endTime - Date.now()) / 1000)) : intervalMinutes * 60
      );

      useEffect(() => {
        if (!isActive || !endTime) return;
        setSecondsLeft(Math.max(0, Math.round((endTime - Date.now()) / 1000)));
        const timer = setInterval(() => {
          setSecondsLeft(Math.max(0, Math.round((endTime - Date.now()) / 1000)));
        }, 1000);
        return () => clearInterval(timer);
      }, [isActive, endTime]);

      return (
        <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg bg-gray-100 text-gray-700">
          Next screenshot in {formatTime(secondsLeft)}
        </div>
      );
    }
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px-var(--header-height))] bg-[#f8fafc] dark:bg-background">

      <canvas ref={canvasRef} className="hidden" />
      <div className="mb-6 flex gap-2">
        <button
          className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${activeTab === 'single'
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 border border-primary/20'
            : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border/20'
            }`}
          onClick={() => {
            if ((isSharing || isSharing2) && activeTab !== 'single') {
              setPendingTab('single');
              setShowTabSwitchConfirm(true);
              setAutoCaptureInterval1(null)
              setAutoCaptureInterval2(null)
              setAutoCaptureInterval(null)
            } else {
              setActiveTab('single');
            }
          }}
        >
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Single Timeframe
          </div>
        </button>
        <button
          className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${activeTab === 'multi'
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 border border-primary/20'
            : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border/20'
            }`}
          onClick={() => {
            if ((isSharing || isSharing2) && activeTab !== 'multi') {
              setPendingTab('multi');
              setShowTabSwitchConfirm(true);
              setAutoCaptureInterval1(null)
              setAutoCaptureInterval2(null)
              setAutoCaptureInterval(null)
            } else {
              setActiveTab('multi');
            }
          }}
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Multi Timeframe
          </div>
        </button>
      </div>
      <div className={`${activeTab === 'multi' ? 'w-12xl px-2' : 'container mx-auto px-4'} py-6`}>
        <div className={`grid ${activeTab === 'multi' ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-3'} gap-6`}>
          {/* Left Column - Screen Preview */}
          <div className={`${activeTab === 'multi' ? 'w-full' : 'xl:col-span-2'} space-y-6`}>
            {activeTab === 'single' ? (
              <div className="bg-card dark:bg-card border border-border rounded-2xl shadow-lg overflow-hidden backdrop-blur">
                <div className={`bg-muted/50 border-b border-border/40 px-6 py-4 flex justify-between items-center`}>
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    {isSharing ? (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse dark:text-white"></div>
                        Live Screen Share
                      </>
                    ) : (
                      <>
                        <MonitorOff className="w-5 h-5 text-muted-foreground" />
                        Screen Preview
                      </>
                    )}
                  </h2>
                  {isSharing && (
                    <div className="flex items-center gap-2">
                      <label htmlFor="auto-capture-interval" className="text-sm text-foreground font-medium mr-2">Auto Capture</label>
                      <select
                        id="auto-capture-interval"
                        className="rounded-md border-border text-sm px-2 py-1 bg-background focus:ring-primary focus:border-primary"
                        value={autoCaptureInterval ?? ''}
                        onChange={e => setAutoCaptureInterval(e.target.value ? Number(e.target.value) : null)}
                      >
                        <option value="">Off</option>
                        <option value="1">Every 1 min</option>
                        <option value="5">Every 5 min</option>
                        <option value="30">Every 30 min</option>
                        <option value="60">Every 1 hour</option>
                        <option value="90">Every 1.5 hour</option>
                        <option value="120">Every 2 hour</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="relative bg-gray-900" style={{ width: '100%', aspectRatio: '16/9' }}>
                  {isSharing && stream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-contain bg-black"
                      onLoadedMetadata={() => {
                        if (videoRef.current) videoRef.current.play().catch(console.error);
                      }}
                      onError={(e) => setError('Error displaying video stream')}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                          {isSharing ? 'Loading screen share...' : 'No screen sharing active'}
                        </h3>
                        <p className="text-muted-foreground">
                          {isSharing ? 'Please wait while we load your screen' : 'Click "Start Sharing" to begin sharing your screen'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center p-4">
                  {isSharing ? (
                    <div className="flex gap-4">
                      <button onClick={stopScreenShare} className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 bg-destructive text-destructive-foreground focus:ring-destructive/20 shadow-lg shadow-destructive/25">
                        <Square className="w-6 h-6" />
                        Stop Sharing
                      </button>
                      {autoCaptureInterval ? (
                        <NextScreenshotTimer intervalMinutes={autoCaptureInterval} isActive={isSharing} endTime={nextScreenshotEndTime} />
                      ) : (
                        <button onClick={handleScreenshot} disabled={isAnalyzing} className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 bg-primary text-primary-foreground shadow-lg shadow-primary/25 focus:ring-primary/20 ${isAnalyzing ? 'cursor-not-allowed opacity-60 hover:scale-100' : 'cursor-pointer'}`}>
                          <Camera className="w-6 h-6" />
                          Capture
                        </button>
                      )}
                    </div>
                  ) : (
                    <button onClick={toggleScreenShare} className="w-full max-w-md flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 bg-primary hover:bg-primary/80 text-primary-foreground focus:ring-primary/20 shadow-lg shadow-primary/25">
                      <Play className="w-6 h-6" />
                      Start Sharing
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex gap-3 flex-col">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* First Screen Share */}
                  <div className=" flex-1 bg-card dark:bg-card border border-border rounded-2xl shadow-lg overflow-hidden backdrop-blur">
                    <div className={`bg-muted/50 border-b border-border/40 px-6 py-4 flex justify-between items-center`}>
                      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        {isSharing ? (
                          <><div className="w-3 h-3 bg-red-500 rounded-full animate-pulse dark:text-white"></div>Lower time frame Screen</>
                        ) : (
                          <><MonitorOff className="w-5 h-5 text-muted-foreground" />Lower time frame Screen</>
                        )}
                      </h2>
                      {isSharing && (
                        <div className="flex items-center gap-2">
                          <label htmlFor="auto-capture-interval1" className="text-sm text-foreground font-medium mr-2">Auto Capture</label>
                          <select
                            id="auto-capture-interval1"
                            className="rounded-md border-border text-sm px-2 py-1 bg-background focus:ring-primary focus:border-primary"
                            value={autoCaptureInterval1 ?? ''}
                            onChange={e => {
                              const value = e.target.value ? Number(e.target.value) : null;
                              setAutoCaptureInterval1(value);
                              if (value) {
                                captureScreenshot1();
                              }
                            }}
                          >
                            <option value="">Off</option>
                            <option value="1">Every 1 min</option>
                            <option value="2">Every 2 min</option>
                            <option value="5">Every 5 min</option>
                            <option value="30">Every 30 min</option>
                            <option value="60">Every 1 hour</option>
                            <option value="90">Every 1.5 hour</option>
                            <option value="120">Every 2 hour</option>
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="relative bg-gray-900" style={{ width: '100%', aspectRatio: '16/9' }}>
                      {isSharing && stream ? (
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain bg-black" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No screen sharing active</h3>
                            <p className="text-muted-foreground">Click "Start Sharing" to begin sharing your screen</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center gap-4 p-4">
                      {isSharing ? (
                        <button onClick={stopScreenShare} className="flex items-center justify-center gap-3 px-4 py-2 rounded-xl font-semibold text-md transition-all duration-200 bg-red-100 text-red-700 hover:bg-red-200">
                          <Square className="w-5 h-5" /> Stop Sharing
                        </button>
                      ) : (
                        <button onClick={toggleScreenShare} className="flex items-center justify-center gap-3 px-4 py-2 rounded-xl font-semibold text-md transition-all duration-200 bg-primary text-white hover:bg-primary/80">
                          <Play className="w-5 h-5" /> Start Sharing
                        </button>
                      )}
                      {isSharing && (
                        autoCaptureInterval1 ? (
                          <NextScreenshotTimer intervalMinutes={autoCaptureInterval1} isActive={isSharing} endTime={nextScreenshotEndTime1} />
                        ) : (
                          <button onClick={captureScreenshot1} disabled={isAnalyzing1} className={`ml-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-md transition-all duration-200 bg-green-100 text-green-700 hover:bg-green-200 ${isAnalyzing1 ? 'cursor-not-allowed opacity-60 hover:scale-100' : 'cursor-pointer'}`}>
                            <Camera className="w-5 h-5" /> Capture
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  {/* Second Screen Share */}
                  <div className=" flex-1 bg-card dark:bg-card border border-border rounded-2xl shadow-lg overflow-hidden backdrop-blur">
                    <div className={`bg-muted/50 border-b border-border/40 px-6 py-4 flex justify-between items-center`}>
                      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        {isSharing2 ? (
                          <><div className="w-3 h-3 bg-red-500 rounded-full animate-pulse dark:text-white"></div>Higher time frame Screen</>
                        ) : (
                          <><MonitorOff className="w-5 h-5 text-muted-foreground" />Higher time frame Screen</>
                        )}
                      </h2>
                      {isSharing2 && (
                        <div className="flex items-center gap-2">
                          <label htmlFor="auto-capture-interval2" className="text-sm text-foreground font-medium mr-2">Auto Capture</label>
                          <select
                            id="auto-capture-interval2"
                            className="rounded-md border-border text-sm px-2 py-1 bg-background focus:ring-primary focus:border-primary"
                            value={autoCaptureInterval2 ?? ''}
                            onChange={e => {
                              const value = e.target.value ? Number(e.target.value) : null;
                              setAutoCaptureInterval2(value);
                              if (value) {
                                captureScreenshot2();
                              }
                            }}
                          >
                            <option value="">Off</option>
                            <option value="1">Every 1 min</option>
                            <option value="2">Every 2 min</option>
                            <option value="5">Every 5 min</option>
                            <option value="30">Every 30 min</option>
                            <option value="60">Every 1 hour</option>
                            <option value="90">Every 1.5 hour</option>
                            <option value="120">Every 2 hour</option>
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="relative bg-gray-900" style={{ width: '100%', aspectRatio: '16/9' }}>
                      {isSharing2 && stream2 ? (
                        <video ref={videoRef2} autoPlay muted playsInline className="w-full h-full object-contain bg-black" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No screen sharing active</h3>
                            <p className="text-muted-foreground">Click "Start Sharing" to begin sharing your screen</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center gap-4 p-4">
                      {isSharing2 ? (
                        <button onClick={stopScreenShare2} className="flex items-center justify-center gap-3 px-4 py-2 rounded-xl font-semibold text-md transition-all duration-200 bg-red-100 text-red-700 hover:bg-red-200">
                          <Square className="w-5 h-5" /> Stop Sharing
                        </button>
                      ) : (
                        <button onClick={startScreenShare2} className="flex items-center justify-center gap-3 px-4 py-2 rounded-xl font-semibold text-md transition-all duration-200 bg-primary text-white hover:bg-primary/80">
                          <Play className="w-5 h-5" /> Start Sharing
                        </button>
                      )}
                      {isSharing2 && (
                        autoCaptureInterval2 ? (
                          <NextScreenshotTimer intervalMinutes={autoCaptureInterval2} isActive={isSharing2} endTime={nextScreenshotEndTime2} />
                        ) : (
                          <button onClick={captureScreenshot2} disabled={isAnalyzing2} className={`ml-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-md transition-all duration-200 bg-green-100 text-green-700 hover:bg-green-200 ${isAnalyzing2 ? 'cursor-not-allowed opacity-60 hover:scale-100' : 'cursor-pointer'}`}>
                            <Camera className="w-5 h-5" /> Capture
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
                {/* Multi Timeframe: Show two screenshot sections */}
                {activeTab === 'multi' && (


                  isSharing && (showSnapshot1 || showSnapshot2) && (
                    <div className="bg-card dark:bg-card border border-border rounded-2xl shadow-lg overflow-hidden mb-2">
                      <div className="bg-muted/50 border-b border-border/40 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <Camera className="w-5 h-5 text-green-600" />
                          Latest Timeframe Snapshot
                        </h2>
                        <button
                          onClick={analyzeImage1}
                          disabled={isAnalyzing1 || !capturedImage1}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                          {isAnalyzing1 ? 'Analyzing...' : 'Analyze'}
                        </button>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="p-2">
                          {capturedImage1 ? (
                            <div className="relative" style={{ width: '100%', aspectRatio: '16/9' }}>
                              <img
                                src={capturedImage1}
                                alt="Lower timeframe screenshot"
                                className="w-full h-full object-contain border border-gray-200 rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ aspectRatio: '16/9' }}>
                              <p className="text-gray-400 text-center">
                                Click "Capture" to take a screenshot of lower time frame
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          {capturedImage2 ? (
                            <div className="relative" style={{ width: '100%', aspectRatio: '16/9' }}>
                              <img
                                src={capturedImage2}
                                alt="Higher timeframe screenshot"
                                className="w-full h-full object-contain border border-gray-200 rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full" style={{ aspectRatio: '16/9' }}>
                              <p className="text-gray-400 text-center">
                                Click "Capture" to take a screenshot  of higher time frame
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )


                )}
              </div>
            )}
          </div>
          <div className="flex flex-col h-[85vh] gap-6">

            {activeTab === 'single' && isSharing && (

              showSnapshot && (
                <div className="bg-card dark:bg-card border border-border rounded-2xl shadow-lg overflow-hidden mb-6">
                  <div className="bg-muted/50 border-b border-border/40 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Camera className="w-5 h-5 text-green-600" />
                      Latest Snapshot
                    </h2>
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing || !capturedImage}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                    </button>
                  </div>
                  <div className="p-6">
                    {capturedImage ? (
                      <div className="relative" style={{ width: '100%', aspectRatio: '16/9' }}>
                        <img
                          src={capturedImage}
                          alt="Captured screenshot"
                          className="w-full h-full object-contain border border-gray-200 rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ aspectRatio: '16/9' }}>
                        <p className="text-gray-400 text-center">
                          Click "Capture" to take a screenshot
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )




            )}



            {(showAnalysis || allAnalyses.length > 0) && (
              <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {isAnalyzing && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}

                  {/* Analysis History */}
                  {allAnalyses.length > 0 && (
                    <div className="space-y-4">
                      {allAnalyses.map((analysis, analysisIndex) => {
                        // Extract the first trade's timestamp if available, or use current time as fallback
                        const timestamp = analysis.timestamp || new Date().toISOString();
                        const formattedDateTime = new Date(timestamp).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        });

                        return (
                          <div key={`history-${analysisIndex}`} className="space-y-2 mb-5">
                            <div className="flex gap-1 items-center text-md font-medium text-gray-500 ">
                              <Clock className="w-4 h-4 mr-1" />
                              Analysis at {formattedDateTime}
                            </div>
                            {analysis.data.map((trade: any, tradeIndex: number) => (
                              <AnalysisResultItem key={`trade-${tradeIndex}`} trade={trade} index={tradeIndex} />
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && selectedAnalysis && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Analysis Details</DialogTitle>
              <DialogDescription>
                Detailed analysis of the selected trade
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">


              {selectedAnalysis.risk_reward && selectedAnalysis.risk_reward !== 'N/A' && (
                <div className="mb-3 p-2.5 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-700">Risk/Reward</span>
                    <span className="px-2 py-0.5 bg-white rounded text-xs font-semibold text-primary border border-primary/20">
                      {selectedAnalysis.risk_reward}
                    </span>
                  </div>
                </div>
              )}

              {selectedAnalysis?.rationale && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Analysis</h3>
                  <p className="text-gray-600 whitespace-pre-line">{selectedAnalysis.rationale}</p>
                </div>
              )}

              {selectedAnalysis.entry?.includes('(') && (
                <div className="bg-gray-100 px-4 py-2 text-xs border-t border-gray-100 rounded-b-xl italic text-gray-500 mt-2">
                  {selectedAnalysis.entry.match(/\(([^)]+)\)/)?.[1]}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      {showTabSwitchConfirm && (
        <Dialog open={showTabSwitchConfirm} onOpenChange={setShowTabSwitchConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                Switching tabs will stop all active screen sharing. Do you want to continue?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => {
                  setShowTabSwitchConfirm(false);
                  setPendingTab(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80"
                onClick={() => {
                  setShowTabSwitchConfirm(false);
                  if (isSharing) stopScreenShare();
                  if (isSharing2) stopScreenShare2();
                  if (pendingTab) setActiveTab(pendingTab);
                  setCapturedImage1(null)
                  setCapturedImage2(null)
                  setCapturedImage(null)
                  setAutoCaptureInterval1(null)
                  setAutoCaptureInterval2(null)
                  setAutoCaptureInterval(null)
                  setPendingTab(null);
                }}
              >
                Yes, Switch
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Dashboard;
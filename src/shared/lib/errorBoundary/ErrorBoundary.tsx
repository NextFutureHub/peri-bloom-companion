import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { GradientButton } from "@/shared/ui/atoms/button-variants";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-soft">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Что-то пошло не так</CardTitle>
              <CardDescription>
                Произошла ошибка при загрузке страницы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-mono text-muted-foreground">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <GradientButton onClick={this.handleReset} className="flex-1">
                  Попробовать снова
                </GradientButton>
                <GradientButton
                  onClick={() => (window.location.href = "/")}
                  className="flex-1"
                  variant="outline"
                >
                  На главную
                </GradientButton>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}


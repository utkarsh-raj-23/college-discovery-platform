'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchQuestions, postQuestion, postAnswer } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import {
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

export default function QAPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [answerTexts, setAnswerTexts] = useState<Record<number, string>>({});
  const { token } = useAuthStore();
  const qc = useQueryClient();

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: () => fetchQuestions(),
  });

  const askMutation = useMutation({
    mutationFn: () => postQuestion({ title, body }),
    onSuccess: () => {
      setTitle('');
      setBody('');
      setShowForm(false);
      qc.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const answerMutation = useMutation({
    mutationFn: ({ qId, text }: { qId: number; text: string }) =>
      postAnswer(qId, text),
    onSuccess: (_, { qId }) => {
      setAnswerTexts((prev) => ({ ...prev, [qId]: '' }));
      qc.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Q&A Forum</h1>
        {token && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Ask Question
          </button>
        )}
      </div>

      {!token && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center text-sm text-blue-700">
          <Link href="/login" className="font-semibold underline">
            Login
          </Link>{' '}
          to ask questions and post answers
        </div>
      )}

      {showForm && token && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Ask a Question</h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Question title (e.g. What is the hostel fee at IIT Bombay?)"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Describe your question in detail..."
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => askMutation.mutate()}
              disabled={!title || !body || askMutation.isPending}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {askMutation.isPending ? 'Posting...' : 'Post Question'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <MessageCircle
            className="mx-auto mb-3 text-gray-300"
            size={48}
          />
          <p>No questions yet. Be the first to ask!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q: any) => (
            <div
              key={q.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                className="w-full p-4 text-left flex items-start justify-between gap-3"
                onClick={() =>
                  setOpenQ(openQ === q.id ? null : q.id)
                }
              >
                <div className="flex items-start gap-3">
                  <MessageCircle
                    size={18}
                    className="text-blue-500 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {q.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {q.answers?.length || 0} answers · Asked by{' '}
                      {q.user?.name}
                    </p>
                  </div>
                </div>
                {openQ === q.id ? (
                  <ChevronUp
                    size={18}
                    className="text-gray-400 flex-shrink-0"
                  />
                ) : (
                  <ChevronDown
                    size={18}
                    className="text-gray-400 flex-shrink-0"
                  />
                )}
              </button>

              {openQ === q.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <p className="text-gray-600 text-sm mb-4">{q.body}</p>

                  {q.answers?.map((a: any) => (
                    <div
                      key={a.id}
                      className="bg-white rounded-lg p-3 mb-2 border border-gray-200"
                    >
                      <p className="text-sm text-gray-700">{a.body}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        — {a.user?.name}
                      </p>
                    </div>
                  ))}

                  {token && (
                    <div className="flex gap-2 mt-3">
                      <input
                        value={answerTexts[q.id] || ''}
                        onChange={(e) =>
                          setAnswerTexts((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        placeholder="Write your answer..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      <button
                        onClick={() =>
                          answerMutation.mutate({
                            qId: q.id,
                            text: answerTexts[q.id] || '',
                          })
                        }
                        disabled={
                          !answerTexts[q.id] || answerMutation.isPending
                        }
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
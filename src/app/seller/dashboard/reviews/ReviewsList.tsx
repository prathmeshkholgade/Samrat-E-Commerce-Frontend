import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setSearchQuery,
  setRatingFilter,
  setStatusFilter,
  setCurrentPage,
  resetFilters,
} from '../../../../store/slices/sellerReviewsSlice';
import {
  useGetSellerReviewsQuery,
  useReplyToReviewMutation,
  useReportReviewMutation,
} from '../../../../store/services/sellerApi';
import type { SellerReview } from '../../../../shared/types';

// Components
import ReviewAnalytics from './components/ReviewAnalytics';
import ReviewFilters from './components/ReviewFilters';
import ReviewTable from './components/ReviewTable';
import ReplyReviewModal from './components/ReplyReviewModal';

export const ReviewsList: React.FC = () => {
  const dispatch = useAppDispatch();

  // Filters State selector
  const { searchQuery, ratingFilter, statusFilter, currentPage, itemsPerPage } = useAppSelector(
    (state) => state.sellerReviews
  );

  // RTK Query hooks
  const { data: allReviews = [], isLoading } = useGetSellerReviewsQuery();
  const [replyToReview] = useReplyToReviewMutation();
  const [reportReview] = useReportReviewMutation();

  // Modals Local State
  const [selectedReviewForReply, setSelectedReviewForReply] = useState<SellerReview | null>(null);

  // 1. Filter reviews client-side
  const filteredReviews = allReviews.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      ratingFilter === 'All' ||
      r.rating === parseInt(ratingFilter);

    let matchesStatus = true;
    if (statusFilter === 'Replied') {
      matchesStatus = r.reply !== undefined;
    } else if (statusFilter === 'Unreplied') {
      matchesStatus = r.reply === undefined && r.status !== 'Reported';
    } else if (statusFilter === 'Reported') {
      matchesStatus = r.status === 'Reported';
    }

    return matchesSearch && matchesRating && matchesStatus;
  });

  // Sort by date desc (default)
  const sortedReviews = [...filteredReviews].sort((a, b) => b.date.localeCompare(a.date));

  // Pagination bounds slicing
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = sortedReviews.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleReplySubmit = async (replyMessage: string) => {
    if (!selectedReviewForReply) return;
    try {
      await replyToReview({ id: selectedReviewForReply.id, replyMessage }).unwrap();
    } catch (err) {
      console.error('Failed to submit review reply:', err);
      alert('Error publishing response');
    }
  };

  const handleReportReview = async (review: SellerReview) => {
    const confirmReport = window.confirm(`Are you sure you want to flag and report this review from ${review.customerName}? This will lock the review and send it for store manager moderation.`);
    if (!confirmReport) return;
    
    try {
      await reportReview(review.id).unwrap();
    } catch (err) {
      console.error('Failed to report review:', err);
      alert('Error flagging review');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Title Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2.5">
            <MessageSquare className="text-indigo-650" size={24} />
            <span>Store Reviews Moderator</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Audit customer product ratings, respond to feedback reviews, and report fraudulent comments.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-3xs flex items-center justify-center min-h-[350px]">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-650 animate-spin" />
        </div>
      ) : (
        <>
          {/* Analytics header distributions widget */}
          <ReviewAnalytics reviews={allReviews} />

          {/* Filters bars */}
          <ReviewFilters
            searchQuery={searchQuery}
            ratingFilter={ratingFilter}
            statusFilter={statusFilter}
            onSearchChange={(q) => dispatch(setSearchQuery(q))}
            onRatingChange={(r) => dispatch(setRatingFilter(r))}
            onStatusChange={(s) => dispatch(setStatusFilter(s))}
            onResetFilters={() => dispatch(resetFilters())}
          />

          {/* List reviews table */}
          <ReviewTable
            reviews={paginatedReviews}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalCount={sortedReviews.length}
            onPageChange={(p) => dispatch(setCurrentPage(p))}
            onReply={(r) => setSelectedReviewForReply(r)}
            onReport={handleReportReview}
          />
        </>
      )}

      {/* REPLY MODAL OVERLAY */}
      <ReplyReviewModal
        isOpen={selectedReviewForReply !== null}
        review={selectedReviewForReply}
        onClose={() => setSelectedReviewForReply(null)}
        onSave={handleReplySubmit}
      />

    </div>
  );
};

export default ReviewsList;

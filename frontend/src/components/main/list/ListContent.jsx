import ImgCard from "components/main/ImgCard";
import SortSelect from "components/main/list/SortSelect";
import FeedbackMessage from "components/common/FeedbackMessage";
import IconFeedback from "components/common/IconFeedback";
import { FEEDBACK_ICONS } from "constants/feedbackIcons";
import { formatErrorMessage } from "utils/messages";

export default function ListContent({
  sortOption,
  onSortChange,
  items,
  loading,
  error,
  sentinelRef,
  onCardClick,
}) {
  const showLoading = loading && items.length === 0;
  const showEmpty = !loading && items.length === 0 && !error;
  const showError = Boolean(error);

  const feedbackNode = showError ? (
    <IconFeedback
      icon={FEEDBACK_ICONS.error}
      message={formatErrorMessage(error)}
      role="alert"
    />
  ) : showLoading ? (
    <FeedbackMessage>불러오는 중...</FeedbackMessage>
  ) : showEmpty ? (
    <IconFeedback icon={FEEDBACK_ICONS.noResult} message="결과가 없습니다." />
  ) : null;

  return (
    <main className="contentsWrapper">
      <div className="sortSelectArea">
        <SortSelect sortOption={sortOption} onSortChange={onSortChange} />
      </div>

      {feedbackNode ? (
        feedbackNode
      ) : (
        <>
          <div className="listContainer">
            {items.map((entry, idx) => (
              <ImgCard
                key={entry.URL || entry.TITLE || idx}
                title={entry.TITLE}
                address={entry.HOST_INST_NM}
                sPeriod={entry.BEGIN_DE}
                ePeriod={entry.END_DE}
                imageUrl={entry.IMAGE_URL}
                onClick={() => onCardClick(entry.TITLE)}
              />
            ))}
          </div>

          {/* 스크롤 센티널 */}
          <div ref={sentinelRef} style={{ height: 1 }} />
        </>
      )}
    </main>
  );
}

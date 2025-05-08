import { Card, Skeleton } from '@mui/material';

function PropertyCardSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton variant="rectangular" height={192} animation="wave" />
      <div className="p-4">
        <Skeleton variant="text" height={32} width="80%" animation="wave" className="mb-2" />
        <Skeleton variant="text" height={24} width="60%" animation="wave" className="mb-2" />
        <Skeleton variant="text" height={28} width="40%" animation="wave" />
      </div>
    </Card>
  );
}

export default PropertyCardSkeleton; 
# TODO: Update Frontend to Show Real Sales Data Instead of Mock Data

## Completed Tasks
- [x] Update SaleService.addSale() to send FormData instead of JSON to match backend multipart form data expectation
- [x] Change SaleComponent form from vehicleRefId to vehicleId to match model and backend
- [x] Remove mock data fallback in SalesListComponent.loadSales() to only load from backend
- [x] Remove unused loadMockData() method from SalesListComponent

## Summary of Changes
- Fixed data submission format to backend (FormData with JSON blob)
- Aligned frontend form field names with backend expectations
- Ensured sales list only displays real data from backend, not mock samples
- Sales created from frontend will now appear in the vehicle management sales list

## Testing
- Verify that adding a sale through the frontend saves to backend and appears in sales list
- Confirm no mock data is shown when backend is available
- Check error handling when backend is unavailable (shows empty list with error message)

import { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import {
	BottomSheetModal,
	BottomSheetModalProvider,
	BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

const BottomSheet = forwardRef(
	({ onClose, children, snapPoint = '50%' }, ref) => {
		const bottomSheetModalRef = useRef(null);

		useImperativeHandle(ref, () => ({
			present: () => {
				bottomSheetModalRef.current?.present();
			},
			close: () => {
				bottomSheetModalRef.current?.close();
			},
		}));

		const renderBackdrop = useCallback(
			(props) => (
				<BottomSheetBackdrop
					{...props}
					disappearsOnIndex={-1}
					appearsOnIndex={1}
					opacity={0.8}
				/>
			),
			[]
		);

		return (
			<BottomSheetModalProvider>
				<BottomSheetModal
					onDismiss={onClose}
					ref={bottomSheetModalRef}
					snapPoints={[`${snapPoint}%, ${snapPoint}%, ${snapPoint}%`]}
					index={0}
					backdropComponent={renderBackdrop}
				>
					{children}
				</BottomSheetModal>
			</BottomSheetModalProvider>
		);
	}
);

export default BottomSheet;

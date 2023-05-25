import { useRef, useImperativeHandle, forwardRef } from 'react';
import { View } from 'react-native';
import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const BottomSheet = forwardRef(
	({ onClose, children, snapPoints = ['50%, 50%, 50%'] }, ref) => {
		const bottomSheetModalRef = useRef(null);

		useImperativeHandle(ref, () => ({
			present: () => {
				bottomSheetModalRef.current?.present();
			},
			close: () => {
				bottomSheetModalRef.current?.close();
			},
		}));

		return (
			<BottomSheetModalProvider>
				<BottomSheetModal
					onDismiss={onClose}
					ref={bottomSheetModalRef}
					snapPoints={snapPoints}
					index={0}
				>
					<View>{children}</View>
				</BottomSheetModal>
			</BottomSheetModalProvider>
		);
	}
);

export default BottomSheet;

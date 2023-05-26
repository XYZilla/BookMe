import { useRef, useImperativeHandle, forwardRef } from 'react';
import { View } from 'react-native';
import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const BottomSheet = forwardRef(({ onClose, children }, ref) => {
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
				snapPoints={['54%, 50%, 50%']}
				index={0}
			>
				<View>{children}</View>
			</BottomSheetModal>
		</BottomSheetModalProvider>
	);
});

export default BottomSheet;

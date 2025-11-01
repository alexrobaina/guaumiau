import React, {memo, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  Modal,
  StyleProp,
  ViewStyle,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {Calendar} from 'lucide-react-native';
import {Text} from '../Text';
import {styles} from './styles';

interface IDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const DatePicker = memo<IDatePickerProps>(
  ({
    value,
    onChange,
    placeholder = 'Seleccionar fecha',
    mode = 'date',
    minimumDate,
    maximumDate,
    disabled = false,
    style,
  }) => {
    const [show, setShow] = useState(false);

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') {
        setShow(false);
      }

      if (event.type === 'set' && selectedDate) {
        onChange(selectedDate);
      }
    };

    const formatDate = (date: Date): string => {
      if (!date) return placeholder;

      if (mode === 'time') {
        return date.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      if (mode === 'datetime') {
        return date.toLocaleString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const renderPicker = () => (
      <DateTimePicker
        value={value || new Date()}
        mode={mode}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={onDateChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    );

    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          style={[styles.input, disabled && styles.disabled]}
          onPress={() => !disabled && setShow(true)}
          disabled={disabled}
          activeOpacity={0.7}>
          <Text
            variant="body"
            style={[styles.text, !value && styles.placeholder]}>
            {value ? formatDate(value) : placeholder}
          </Text>
          <Calendar size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {Platform.OS === 'ios' ? (
          <Modal
            visible={show}
            transparent
            animationType="slide"
            onRequestClose={() => setShow(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShow(false)}>
                    <Text variant="body" color="primary">
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShow(false)}>
                    <Text variant="body" color="primary" style={styles.doneText}>
                      Listo
                    </Text>
                  </TouchableOpacity>
                </View>
                {renderPicker()}
              </View>
            </View>
          </Modal>
        ) : (
          show && renderPicker()
        )}
      </View>
    );
  },
);
